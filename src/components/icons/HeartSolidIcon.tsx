/* eslint-disable react/style-prop-object */

export default function HeartSolidIcon({
  fill = "#c6d3e7",
  width = 16,
  height = 16,
  className = "",
  styles = {},
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 512.001 512.001"
      width={width}
      height={height}
      className={className}
      style={{ ...styles }}
      fill={fill}
    >
      <path d="m376 43.839c-60.645 0-99.609 39.683-120 75.337-20.391-35.654-59.355-75.337-120-75.337-76.963 0-136 58.945-136 137.124 0 84.771 73.964 142.5 184.413 229.907 54.082 42.761 57.557 46.011 71.587 57.29 11.45-9.205 17.787-14.751 71.587-57.29 110.449-87.407 184.413-145.136 184.413-229.907 0-78.178-59.037-137.124-136-137.124z" />
    </svg>
  );
}
