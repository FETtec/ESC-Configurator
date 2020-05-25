"use strict";

const appdmg = require("appdmg");

const pkg = require("./package.json");

const fs = require("fs");
const path = require("path");
const exec = require("child_process").exec;
const execSync = require("child_process").execSync;

const zip = require("gulp-zip");
const del = require("del");
const NwBuilder = require("nw-builder");
const makensis = require("makensis");

const buildRpm = require("rpm-builder");
const commandExistsSync = require("command-exists").sync;

const gulp = require("gulp");
const yarn = require("gulp-yarn");
const rename = require("gulp-rename");
const os = require("os");
const git = require("git-rev-sync");

const DIST_DIR = "./dist/";
const APPS_DIR = "./apps/";
const DEBUG_DIR = "./debug/";
const RELEASE_DIR = "./release/";

const LINUX_INSTALL_DIR = "/opt/fettec-esc-config";

var nwBuilderOptions = {
  version: "0.46.0",
  files: "./dist/**/*",
  macIcns: "./src/images/fettec-256x256.icns",
  macPlist: {
    CFBundleDisplayName: "FETtec ESC Configurator",
    CFBundleIdentifier: "com.fettec.configurator"
  },
  //    winIco: './src/images/fettec-256x256.ico',
  zip: false
};

//-----------------
//Pre tasks operations
//-----------------
const SELECTED_PLATFORMS = getInputPlatforms();

//-----------------
//Tasks
//-----------------

gulp.task(
  "clean",
  gulp.parallel(clean_dist, clean_apps, clean_debug, clean_release)
);

gulp.task("clean-dist", clean_dist);

gulp.task("clean-apps", clean_apps);

gulp.task("clean-debug", clean_debug);

gulp.task("clean-release", clean_release);

gulp.task("clean-cache", clean_cache);

var distBuild = gulp.series(dist_src);
var distRebuild = gulp.series(clean_dist, distBuild);
gulp.task("dist", distRebuild);

var appsBuild = gulp.series(
  gulp.parallel(clean_apps, distRebuild),
  apps,
  gulp.parallel(listPostBuildTasks(APPS_DIR))
);
gulp.task("apps", appsBuild);

var debugBuild = gulp.series(
  distBuild,
  debug,
  gulp.parallel(listPostBuildTasks(DEBUG_DIR)),
  start_debug
);
gulp.task("debug", debugBuild);

var releaseBuild = gulp.series(
  gulp.parallel(clean_release, appsBuild),
  gulp.parallel(listReleaseTasks())
);
gulp.task("release", releaseBuild);

gulp.task("default", debugBuild);

// -----------------
// Helper functions
// -----------------

// Get platform from commandline args
// #
// # gulp <task> [<platform>]+        Run only for platform(s) (with <platform> one of --linux64, --linux32, --osx64, --win32, --win64, or --chromeos)
// #
function getInputPlatforms() {
  var supportedPlatforms = [
    "linux64",
    "linux32",
    "osx64",
    "win32",
    "win64",
    "chromeos"
  ];
  var platforms = [];
  var regEx = /--(\w+)/;
  console.log(process.argv);
  for (var i = 3; i < process.argv.length; i++) {
    var arg = process.argv[i].match(regEx)[1];
    if (supportedPlatforms.indexOf(arg) > -1) {
      platforms.push(arg);
    } else {
      console.log("Unknown platform: " + arg);
      process.exit();
    }
  }

  if (platforms.length === 0) {
    var defaultPlatform = getDefaultPlatform();
    if (supportedPlatforms.indexOf(defaultPlatform) > -1) {
      platforms.push(defaultPlatform);
    } else {
      console.error(
        `Your current platform (${os.platform()}) is not a supported build platform. Please specify platform to build for on the command line.`
      );
      process.exit();
    }
  }

  if (platforms.length > 0) {
    console.log("Building for platform(s): " + platforms + ".");
  } else {
    console.error("No suitable platforms found.");
    process.exit();
  }

  return platforms;
}

// Gets the default platform to be used
function getDefaultPlatform() {
  var defaultPlatform;
  switch (os.platform()) {
    case "darwin":
      defaultPlatform = "osx64";

      break;
    case "linux":
      defaultPlatform = "linux64";

      break;
    case "win32":
      defaultPlatform = "win32";

      break;

    default:
      defaultPlatform = "";

      break;
  }
  return defaultPlatform;
}

function getPlatforms() {
  return SELECTED_PLATFORMS.slice();
}

function removeItem(platforms, item) {
  var index = platforms.indexOf(item);
  if (index >= 0) {
    platforms.splice(index, 1);
  }
}

function getRunDebugAppCommand(arch) {
  switch (arch) {
    case "osx64":
      return "open " + path.join(DEBUG_DIR, pkg.name, arch, pkg.name + ".app");

      break;

    case "linux64":
    case "linux32":
      return path.join(DEBUG_DIR, pkg.name, arch, pkg.name);

      break;

    case "win32":
    case "win64":
      return path.join(DEBUG_DIR, pkg.name, arch, pkg.name + ".exe");

      break;

    default:
      return "";

      break;
  }
}

function getReleaseFilename(platform, ext) {
  return (
    pkg.name +
    "_" +
    pkg.version +
    "-" +
    git.short() +
    "-" +
    platform +
    "." +
    ext
  );
}

function clean_dist() {
  return del([DIST_DIR + "**"], { force: true });
}

function clean_apps() {
  return del([APPS_DIR + "**"], { force: true });
}

function clean_debug() {
  return del([DEBUG_DIR + "**"], { force: true });
}

function clean_release() {
  return del([RELEASE_DIR + "**"], { force: true });
}

function clean_cache() {
  return del(["./cache/**"], { force: true });
}

// Real work for dist task. Done in another task to call it via
// run-sequence.
function dist_src() {
  var distSources = ["./src/**/*"];

  return (
    gulp
      .src(distSources, { base: "." })
      .pipe(gulp.src("manifest.json", { passthrougth: true }))
      .pipe(gulp.src("package.json", { passthrougth: true }))
      // .pipe(gulp.src('changelog.html', { passthrougth: true }))
      .pipe(gulp.dest(DIST_DIR))
      .pipe(
        yarn({
          production: true,
          ignoreScripts: true
        })
      )
  );
}

// Create runnable app directories in ./apps
function apps(done) {
  var platforms = getPlatforms();
  removeItem(platforms, "chromeos");

  buildNWApps(platforms, "normal", APPS_DIR, done);
}

function listPostBuildTasks(folder, done) {
  var platforms = getPlatforms();

  var postBuildTasks = [];

  if (platforms.indexOf("linux32") != -1) {
    postBuildTasks.push(function post_build_linux32(done) {
      return post_build("linux32", folder, done);
    });
  }

  if (platforms.indexOf("linux64") != -1) {
    postBuildTasks.push(function post_build_linux64(done) {
      return post_build("linux64", folder, done);
    });
  }

  // We need to return at least one task, if not gulp will throw an error
  if (postBuildTasks.length == 0) {
    postBuildTasks.push(function post_build_none(done) {
      done();
    });
  }
  return postBuildTasks;
}

function post_build(arch, folder, done) {
  if (arch === "linux32" || arch === "linux64") {
    // Copy Ubuntu launcher scripts to destination dir
    var launcherDir = path.join(folder, pkg.name, arch);
    console.log("Copy Ubuntu launcher scripts to " + launcherDir);
    return gulp.src("assets/linux/**").pipe(gulp.dest(launcherDir));
  }

  return done();
}

// Create debug app directories in ./debug
function debug(done) {
  var platforms = getPlatforms();
  removeItem(platforms, "chromeos");

  buildNWApps(platforms, "sdk", DEBUG_DIR, done);
}

function buildNWApps(platforms, flavor, dir, done) {
  if (platforms.length > 0) {
    var builder = new NwBuilder(
      Object.assign(
        {
          buildDir: dir,
          platforms: platforms,
          flavor: flavor
        },
        nwBuilderOptions
      )
    );
    builder.on("log", console.log);
    builder.build(function(err) {
      if (err) {
        console.log("Error building NW apps: " + err);
        clean_debug();
        process.exit(1);
      }
      done();
    });
  } else {
    console.log("No platform suitable for NW Build");
    done();
  }
}

function start_debug(done) {
  var platforms = getPlatforms();

  if (platforms.length === 1) {
    var run = getRunDebugAppCommand(platforms[0]);
    console.log("Starting debug app (" + run + ")...");
    exec(run);
  } else {
    console.log("More than one platform specified, not starting debug app");
  }
  done();
}

// Create installer package for windows platforms
function release_win(arch, done) {
  // Check if makensis exists
  if (!commandExistsSync("makensis")) {
    console.warn(
      "makensis command not found, not generating win package for " + arch
    );
    return done();
  }

  // The makensis does not generate the folder correctly, manually
  createDirIfNotExists(RELEASE_DIR);

  // Parameters passed to the installer script
  const options = {
    verbose: 2,
    define: {
      VERSION: pkg.version,
      PLATFORM: arch,
      DEST_FOLDER: RELEASE_DIR
    }
  };

  var output = makensis.compileSync("./assets/windows/installer.nsi", options);

  if (output.status !== 0) {
    console.error(
      "Installer for platform " +
        arch +
        " finished with error " +
        output.status +
        ": " +
        output.stderr
    );
  }

  done();
}

// Create distribution package (zip) for windows and linux platforms
function release_zip(arch) {
  var src = path.join(APPS_DIR, pkg.name, arch, "**");
  var output = getReleaseFilename(arch, "zip");
  var base = path.join(APPS_DIR, pkg.name, arch);

  return compressFiles(src, base, output, "FETtec ESC Configurator");
}

// Create distribution package for chromeos platform
function release_chromeos() {
  var src = path.join(DIST_DIR, "**");
  var output = getReleaseFilename("chromeos", "zip");
  var base = DIST_DIR;

  return compressFiles(src, base, output, ".");
}

// Compress files from srcPath, using basePath, to outputFile in the RELEASE_DIR
function compressFiles(srcPath, basePath, outputFile, zipFolder) {
  return gulp
    .src(srcPath, { base: basePath })
    .pipe(
      rename(function(actualPath) {
        actualPath.dirname = path.join(zipFolder, actualPath.dirname);
      })
    )
    .pipe(zip(outputFile))
    .pipe(gulp.dest(RELEASE_DIR));
}

function release_deb(arch, done) {
  // Check if dpkg-deb exists
  if (!commandExistsSync("dpkg-deb")) {
    console.warn(
      "dpkg-deb command not found, not generating deb package for " + arch
    );
    return done();
  }

  return gulp.src([path.join(APPS_DIR, pkg.name, arch, "*")]).pipe(
    deb({
      package: pkg.name,
      version: pkg.version,
      section: "base",
      priority: "optional",
      architecture: getLinuxPackageArch("deb", arch),
      maintainer: pkg.author,
      description: pkg.description,
      preinst: [`rm -rf ${LINUX_INSTALL_DIR}/${pkg.name}`],
      postinst: [
        `chown root:root ${LINUX_INSTALL_DIR}`,
        `chown -R root:root ${LINUX_INSTALL_DIR}/${pkg.name}`,
        `xdg-desktop-menu install ${LINUX_INSTALL_DIR}/${pkg.name}/${pkg.name}.desktop`
      ],
      prerm: [`xdg-desktop-menu uninstall ${pkg.name}.desktop`],
      depends: "libgconf-2-4",
      changelog: [],
      _target: `${LINUX_INSTALL_DIR}/${pkg.name}`,
      _out: RELEASE_DIR,
      _copyright: "assets/linux/copyright",
      _clean: true
    })
  );
}

function release_rpm(arch, done) {
  // Check if dpkg-deb exists
  if (!commandExistsSync("rpmbuild")) {
    console.warn(
      "rpmbuild command not found, not generating rpm package for " + arch
    );
    return done();
  }

  // The buildRpm does not generate the folder correctly, manually
  createDirIfNotExists(RELEASE_DIR);

  var options = {
    name: pkg.name,
    version: pkg.version,
    buildArch: getLinuxPackageArch("rpm", arch),
    vendor: pkg.author,
    summary: pkg.description,
    license: "GNU General Public License v3.0",
    requires: "libgconf-2-4",
    prefix: "/opt",
    files: [
      {
        cwd: path.join(APPS_DIR, pkg.name, arch),
        src: "*",
        dest: `${LINUX_INSTALL_DIR}/${pkg.name}`
      }
    ],
    postInstallScript: [
      `xdg-desktop-menu install ${LINUX_INSTALL_DIR}/${pkg.name}/${pkg.name}.desktop`
    ],
    preUninstallScript: [`xdg-desktop-menu uninstall ${pkg.name}.desktop`],
    tempDir: path.join(RELEASE_DIR, "tmp-rpm-build-" + arch),
    keepTemp: false,
    verbose: false,
    rpmDest: RELEASE_DIR,
    execOpts: { maxBuffer: 1024 * 1024 * 16 }
  };

  buildRpm(options, function(err, rpm) {
    if (err) {
      console.error("Error generating rpm package: " + err);
    }
    done();
  });
}

function getLinuxPackageArch(type, arch) {
  var packArch;

  switch (arch) {
    case "linux32":
      packArch = "i386";
      break;
    case "linux64":
      if (type == "rpm") {
        packArch = "x86_64";
      } else {
        packArch = "amd64";
      }
      break;
    default:
      console.error("Package error, arch: " + arch);
      process.exit(1);
      break;
  }

  return packArch;
}
// Create distribution package for macOS platform
function osx64_sign(done) {
  if (commandExistsSync("tmp/code-sign.js")) {
    console.log("Codesign activity...");
    execSync("node tmp/code-sign.js", function(error, stdOut, stdErr) {
    });
  } else {
    console.log("No valid script for codesign");
  }
  //release_zip("osx64",done);
  release_osx64(done);
  return done();
}

function release_osx64(done) {
  // Create DMG
  createDirIfNotExists(RELEASE_DIR);
  const ee = appdmg({
    target: path.join(RELEASE_DIR, getReleaseFilename("macOS", "dmg")),
    basepath: path.join(APPS_DIR, pkg.name, "osx64"),
    specification: {
      title: "FETtec ESC Configurator",
      contents: [
        { x: 448, y: 342, type: "link", path: "/Applications" },
        {
          x: 192,
          y: 344,
          type: "file",
          path: pkg.name + ".app",
          name: "FETtec ESC Configurator.app"
        }
      ],
      format: "UDZO",
      window: {
        size: {
          width: 638,
          height: 479
        }
      }
    }
  }).on("progress", function(info) {
    if (info.type == "step-begin")
      console.log(info.title + " [" + info.current + "/" + info.total + "]");
    else console.log("..");
  });

  ee.on("error", function(err) {
    console.log(err);
  });
  return done();
}

// Create the dir directory, with write permissions
function createDirIfNotExists(dir) {
  fs.mkdir(dir, "0775", function(err) {
    if (err) {
      if (err.code !== "EEXIST") {
        throw err;
      }
    }
  });
}

// Create a list of the gulp tasks to execute for release
function listReleaseTasks(done) {
  var platforms = getPlatforms();

  var releaseTasks = [];

  if (platforms.indexOf("chromeos") !== -1) {
    releaseTasks.push(release_chromeos);
  }

  if (platforms.indexOf("linux64") !== -1) {
    releaseTasks.push(function release_linux64_zip() {
      return release_zip("linux64");
    });
    releaseTasks.push(function release_linux64_deb(done) {
      return release_deb("linux64", done);
    });
    releaseTasks.push(function release_linux64_rpm(done) {
      return release_rpm("linux64", done);
    });
  }

  if (platforms.indexOf("linux32") !== -1) {
    releaseTasks.push(function release_linux32_zip() {
      return release_zip("linux32");
    });
    releaseTasks.push(function release_linux32_deb(done) {
      return release_deb("linux32", done);
    });
    releaseTasks.push(function release_linux32_rpm(done) {
      return release_rpm("linux32", done);
    });
  }

  if (platforms.indexOf("osx64") !== -1) {
    releaseTasks.push(function release_osx64_all(done) {
      return osx64_sign(done);
    });
  }

  if (platforms.indexOf("win32") !== -1) {
    releaseTasks.push(function release_win32_inst(done) {
      return release_win("win32", done);
    });
    releaseTasks.push(function release_win32_zip() {
      return release_zip("win32");
    });
  }

  if (platforms.indexOf("win64") !== -1) {
    releaseTasks.push(function release_win64_inst(done) {
      return release_win("win64", done);
    });
    releaseTasks.push(function release_win64_zip() {
      return release_zip("win64");
    });
  }

  return releaseTasks;
}
