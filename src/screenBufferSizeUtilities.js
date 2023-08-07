/// set console size on windows
const ffi = require("ffi-napi");
const ref = require("ref-napi");
const StructType = require("ref-struct-di")(ref);
const os = require("os");

const BOOL = "int32";

const COORD = StructType({
  X: "short",
  Y: "short",
});

const SMALL_RECT = StructType({
  Left: "short",
  Top: "short",
  Right: "short",
  Bottom: "short",
});

const CONSOLE_SCREEN_BUFFER_INFO = StructType({
  dwSize: COORD,
  dwCursorPosition: COORD,
  wAttributes: "ushort",
  srWindow: SMALL_RECT,
  dwMaximumWindowSize: COORD,
});

const kernel32 = ffi.Library("kernel32.dll", {
  GetStdHandle: ["pointer", ["int32"]],
  GetConsoleScreenBufferInfo: [BOOL, ["pointer", "pointer"]],
  SetConsoleScreenBufferSize: ["int32", ["pointer", COORD]],
});

const STD_OUTPUT_HANDLE = -11;

function setConsoleBufferHeightWindows(height) {
  const handle = kernel32.GetStdHandle(STD_OUTPUT_HANDLE);
  if (ref.isNull(handle)) {
    console.error("Failed to get standard output handle.");
    return;
  }

  const info = new CONSOLE_SCREEN_BUFFER_INFO();
  if (!kernel32.GetConsoleScreenBufferInfo(handle, info.ref())) {
    console.error("Failed to get console screen buffer info.");
    return;
  }

  info.dwSize.Y = height;

  if (!kernel32.SetConsoleScreenBufferSize(handle, info.dwSize)) {
    console.error("Failed to set console screen buffer size.");
    return;
  }

  //console.log(`Console buffer height set to ${height}`);
}

const detectOS = () => {
  switch (os.platform()) {
    case "win32":
      return "windows";
    case "darwin":
      return "mac";
    case "linux":
      return "linux";

    default:
      return "something else";
  }
};

// // Example usage:
// setConsoleBufferHeight(200);
export { detectOS, setConsoleBufferHeightWindows };
