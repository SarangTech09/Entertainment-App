import { Avatar } from "@mui/material";

const TextAvatar = ({ text }) => {
  const stringToColor = (str) => {
    if (!str) return "#000"; // Return a default color if `str` is undefined or null

    let hash = 0;
    let i;

    for (i = 0; i < str.length; i += 1) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  };

  // Ensure `text` is a string, default to an empty string if undefined
  const displayText = text || "";

  return (
    <Avatar
      sx={{
        backgroundColor: stringToColor(displayText),
        width: 40,
        height: 40
      }}
    >
      {displayText.split(" ")[0][0] || "?"} {/* Use "?" if there's no text */}
    </Avatar>
  );
};

export default TextAvatar;
