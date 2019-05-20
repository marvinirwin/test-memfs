var __ffmpegjs_utf8ToStr;

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
    if (key != "mounts" && key != "MEMFS" && key != "cb") {
        Module[key] = __ffmpegjs_opts[key];
    }
});
// Before we run, enter our work directory and create files passed in like {MEMFS: [{name: 'foo.txt', data: new Uint8Array()}]}
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
// After we're done, search for files in our immediate directory
Module["postRun"] = function () {
    function listFiles(dir) {
        var contents = FS.lookupPath(dir).node.contents;
        var filenames = Object.keys(contents);
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
    // Call the callback if we have one
    __ffmpegjs_opts["cb"] && __ffmpegjs_opts["cb"](__ffmpegjs_return);
};

