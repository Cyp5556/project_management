import { useState, useEffect } from "react";
import { Clock, ArrowLeftRight, RotateCcw } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useApp } from "../../contexts/AppContext";

const VersionControl = ({ pageId, currentContent, onRestore }) => {
  const { isDark } = useTheme();
  const { getVersionHistory, compareVersions } = useApp();
  const [versions, setVersions] = useState([]);
  const [selectedVersions, setSelectedVersions] = useState([null, null]);
  const [diffView, setDiffView] = useState(null);

  useEffect(() => {
    const history = getVersionHistory(pageId);
    setVersions(history);
  }, [pageId, getVersionHistory]);

  const handleCompare = async () => {
    if (selectedVersions[0] && selectedVersions[1]) {
      const diff = await compareVersions(
        selectedVersions[0].id,
        selectedVersions[1].id
      );
      setDiffView(diff);
    }
  };

  return (
    <div
      className={`p-4 border rounded-lg ${
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center gap-2 mb-4">
        <Clock size={20} />
        <h2 className="text-lg font-semibold">Version History</h2>
      </div>

      <div className="space-y-4">
        {/* Version List */}
        <div className="grid grid-cols-2 gap-4">
          {[0, 1].map((index) => (
            <select
              key={index}
              value={selectedVersions[index]?.id || ""}
              onChange={(e) => {
                const version = versions.find((v) => v.id === e.target.value);
                setSelectedVersions((prev) => {
                  const next = [...prev];
                  next[index] = version;
                  return next;
                });
              }}
              className={`w-full p-2 rounded ${
                isDark
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <option value="">Select version {index + 1}</option>
              {versions.map((version) => (
                <option key={version.id} value={version.id}>
                  {new Date(version.timestamp).toLocaleString()} by{" "}
                  {version.author}
                </option>
              ))}
            </select>
          ))}
        </div>

        {/* Compare Button */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleCompare}
            disabled={!selectedVersions[0] || !selectedVersions[1]}
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              isDark
                ? "bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700"
                : "bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200"
            } text-white disabled:text-gray-400 transition-colors`}
          >
            <ArrowLeftRight size={16} />
            Compare Versions
          </button>

          {selectedVersions[0] && (
            <button
              onClick={() => onRestore(selectedVersions[0].id)}
              className={`px-4 py-2 rounded flex items-center gap-2 ${
                isDark
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-amber-500 hover:bg-amber-600"
              } text-white transition-colors`}
            >
              <RotateCcw size={16} />
              Restore Version {selectedVersions[0].timestamp}
            </button>
          )}
        </div>

        {/* Diff View */}
        {diffView && (
          <div
            className={`mt-4 p-4 rounded ${
              isDark ? "bg-gray-900" : "bg-gray-50"
            }`}
          >
            <pre className="whitespace-pre-wrap">
              {diffView.map((line, i) => (
                <div
                  key={i}
                  className={`${
                    line.startsWith("+")
                      ? isDark
                        ? "bg-green-900"
                        : "bg-green-100"
                      : line.startsWith("-")
                      ? isDark
                        ? "bg-red-900"
                        : "bg-red-100"
                      : ""
                  }`}
                >
                  {line}
                </div>
              ))}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default VersionControl;
