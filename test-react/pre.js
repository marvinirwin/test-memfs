var __ffmpegjs_utf8ToStr;

// AHHHH
__ffmpegjs_utf8ToStr = UTF8ArrayToString;
__ffmpegjs_opts = Module;
var __ffmpegjs_return;

function __ffmpegjs_toU8(data) {
    if (Array.isArray(data) || data instanceof ArrayBuffer) {
        data = new Uint8Array(data);
    } else if (!data) {
        // `null` for empty files.
        data = new Uint8Array(0);
    } else if (!(data instanceof Uint8Array)) {
        // Avoid unnecessary copying.
        data = new Uint8Array(data.buffer);
    }
    return data;
}

Object.keys(__ffmpegjs_opts).forEach(function (key) {
    if (key != "mounts" && key != "MEMFS") {
        Module[key] = __ffmpegjs_opts[key];
    }
});

Module["preRun"] = function () {
    FS.mkdir("/work");
    FS.chdir("/work");

    (__ffmpegjs_opts["MEMFS"] || []).forEach(function (file) {
        if (file["name"].match(/\//)) {
            throw new Error("Bad file name");
        }
        var fd = FS.open(file["name"], "w+");
        var data = __ffmpegjs_toU8(file["data"]);
        FS.write(fd, data, 0, data.length);
        FS.close(fd);
    });
};

Module["postRun"] = function () {
    // NOTE(Kagami): Search for files only in working directory, one
    // level depth. Since FFmpeg shouldn't normally create
    // subdirectories, it should be enough.
    function listFiles(dir) {
        var contents = FS.lookupPath(dir).node.contents;
        var filenames = Object.keys(contents);
        // Fix for possible file with "__proto__" name. See
        // <https://github.com/kripken/emscripten/issues/3663> for
        // details.
        if (contents.__proto__ && contents.__proto__.name === "__proto__") {
            filenames.push("__proto__");
        }
        return filenames.map(function (filename) {
            return contents[filename];
        });
    }

    var inFiles = Object.create(null);
    (__ffmpegjs_opts["MEMFS"] || []).forEach(function (file) {
        inFiles[file.name] = null;
    });
    var outFiles = listFiles("/work").filter(function (file) {
        return !(file.name in inFiles);
    }).map(function (file) {
        var data = __ffmpegjs_toU8(file.contents);
        return {"name": file.name, "data": data};
    });
    __ffmpegjs_return = {"MEMFS": outFiles};
};
