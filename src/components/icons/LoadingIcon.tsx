/* eslint-disable react/style-prop-object */

export default function LoadingIcon({
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
      className={ "loader " + className}
      style={{ ...styles }}
      fill={fill}
    >
      <g>
        <g xmlns="http://www.w3.org/2000/svg">
          <path d="M256,150a25,25,0,0,1-25-25V25a25,25,0,0,1,50,0V125A25,25,0,0,1,256,150Z" />
          <path d="M256,512a25,25,0,0,1-25-25V387a25,25,0,0,1,50,0V487A25,25,0,0,1,256,512Z" />
          <path d="M125,281H25a25,25,0,0,1,0-50H125a25,25,0,0,1,0,50Z" />
          <path d="M487,281H387a25,25,0,0,1,0-50H487a25,25,0,0,1,0,50Z" />
          <path d="M348.63,188.37A25,25,0,0,1,331,145.69L401.66,75A25,25,0,1,1,437,110.34l-70.71,70.71A24.93,24.93,0,0,1,348.63,188.37Z" />
          <path d="M92.66,444.34A25,25,0,0,1,75,401.66L145.69,331a25,25,0,0,1,35.36,35.36L110.34,437A24.94,24.94,0,0,1,92.66,444.34Z" />
          <path d="M163.37,188.37a24.93,24.93,0,0,1-17.68-7.32L75,110.34A25,25,0,1,1,110.34,75l70.71,70.71a25,25,0,0,1-17.68,42.68Z" />
          <path d="M419.34,444.34A24.94,24.94,0,0,1,401.66,437L331,366.31A25,25,0,0,1,366.31,331L437,401.66a25,25,0,0,1-17.68,42.68Z" />
        </g>
      </g>
    </svg>
  );
}
