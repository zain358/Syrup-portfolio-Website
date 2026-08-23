/**
 * DateSVG.jsx
 *
 * Renders the date using the ACTUAL SVG vector path data extracted from
 * the downloaded sirup.online glyph files (one.svg, two.svg, zero.svg, seven.svg, minus.svg).
 *
 * Each character is an inline <svg> with a tight viewBox crop so only the
 * glyph is visible. No font rasterization = no edgy/stair-stepped edges.
 * Perfectly smooth at any screen size or DPR.
 */

// ── Glyph Definitions ────────────────────────────────────────────────────────
// Path data is lifted verbatim from the downloaded SVG files.
// viewBox is cropped tightly to just the glyph (minX minY width height).
// w/h are the viewBox dimensions — used to compute the correct aspect ratio.
const GLYPHS = {
  '0': {
    d: 'M2163.73,278.148c92.96,0,146.74-62.222,146.74-139.062c0-76.652-53.78-138.874-146.74-138.874c-93.15,0-146.56,62.222-146.56,138.874c0,76.839,53.41,139.061,146.56,139.061V278.148z M2162.98,254.159c-24.55,0-22.68-49.477-22.68-114.7c0-64.845-1.87-115.447,22.68-115.447c26.99,0,23.8,50.6,23.8,115.447c0,65.222,3.19,114.699-23.8,114.699V254.159z',
    viewBox: '2017 0 294 279',
    w: 294, h: 279,
  },
  '1': {
    d: 'M1163.1,273.458h154.24c-18.74-23.427-14.24-105.14-14.24-134V0.211C1263.93,7.52,1221.38,18.2,1161.22,18.2c14.06,10.308,18.37,69.156,18.37,121.257c0,29.99,1.5,110.578-16.49,134.005L1163.1,273.458z',
    viewBox: '1161 0 157 274',
    w: 157, h: 274,
  },
  '2': {
    d: 'M2585.11,273.459h254.14V195.5c-48.92,44.043-138.31,48.166-160.62,48.166c110.77-19.866,168.68-80.966,168.68-136.254c0-77.777-55.29-106.639-138.69-107.2c-107.95-0.75-125.94,45.729-125.94,79.276c0,30.174,24.55,59.786,65.97,59.786c43.29,0,58.66-32.61,58.66-55.1c0-26.425-23.05-52.289-57.54-52.289c4.31-3.373,11.06-5.248,18.93-5.248c23.99,0,57.16,17.992,55.47,68.407c-2.99,91.271-108.51,149.557-139.06,149.557v28.862V273.459z',
    viewBox: '2583 0 258 275',
    w: 258, h: 275,
  },
  '7': {
    d: 'M1351.52,273.458h154.06c-25.86-136.626,16.3-205.594,78.15-268.753h-258.82v142.252c46.11-69.344,125.57-118.072,208.22-118.072c-85.84,52.664-181.61,127.815-181.61,244.577L1351.52,273.458z',
    viewBox: '1323 0 262 274',
    w: 262, h: 274,
  },
  '-': {
    d: 'M1562.03,164.2h158.55v-23.053h-158.55V164.2z',
    // Full digit height so the dash sits naturally at vertical mid-point
    viewBox: '1560 0 162 278',
    w: 162, h: 278,
  },
  't': {
    d: 'M2737.26,764.5c-27.39,17.374-56.8,30.07-88.2,30.07c-45.44,0-83.53-26.729-83.53-76.177V458.461h178.42v-19.378h-178.42v-84.2h-21.38v84.2h-77.51v19.378h77.51V721.07c0,62.144,50.12,92.882,103.57,92.882c36.09,0,71.5-14.7,98.9-33.411L2737.26,764.5z',
    viewBox: '2466 354 280 460',
    w: 280, h: 460,
  },
  'h': {
    d: 'M3023.9,425.719c-84.19,0-151.01,38.088-184.42,102.237V306.108h-20.72v494.48h20.72v-243.9 c36.75-76.845,102.9-111.592,182.42-111.592c104.24,0,152.35,58.8,152.35,155.694v199.8h20.72V600.123 C3194.97,499.222,3142.18,425.719,3023.9,425.719z',
    viewBox: '2818 306 377 495',
    w: 377, h: 495,
  }
};

// Custom margin-right ratios for each character index in '2007-2012':
// 0:'2' (between 2 & 0) -> 0.04
// 1:'0' (between 0 & 0) -> 0.04
// 2:'0' (between 0 & 7) -> 0.08 (slightly)
// 3:'7' (between 7 & -) -> 0.04
// 4:'-' (between - & 2) -> 0.04
// 5:'2' (between 2 & 0 of 2012) -> 0.08 (slightly)
const GAPS = {
  0: 0.04,
  1: 0.04,
  2: 0.08,
  3: 0.04,
  4: 0.04,
  5: 0.08,
};

/**
 * @param {string}  date         - The date string to render (e.g. '2007-2012')
 * @param {string}  height       - CSS height value for each glyph (e.g. '9.3vw')
 * @param {string}  className    - Optional class on the flex wrapper
 * @param {object}  style        - Optional extra styles on the flex wrapper
 * @param {string}  charClass    - Class applied to each glyph <svg> (default 'date-char' for GSAP)
 */
export default function DateSVG({
  date = '2007-2012',
  height = '9.3vw',
  className = '',
  style = {},
  charClass = 'date-char',
}) {
  return (
    <div
      className={className}
      style={{ display: 'flex', alignItems: 'flex-end', ...style }}
    >
      {date.split('').map((char, index) => {
        const glyph = GLYPHS[char];
        if (!glyph) return null;
        const aspect = (glyph.w / glyph.h).toFixed(4);

        return (
          <svg aria-hidden="true"
            key={index}
            className={charClass}
            xmlns="http://www.w3.org/2000/svg"
            viewBox={glyph.viewBox}
            style={{
              height: height,
              width: `calc(${height} * ${aspect})`,
              display: 'block',
              flexShrink: 0,
              overflow: 'visible',
              // Specific breathing gap ratio after each character
              marginRight: GAPS[index] !== undefined ? `calc(${height} * ${GAPS[index]})` : '0',
            }}
          >
            <path
              d={glyph.d}
              fill="#ffffff"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        );
      })}
    </div>
  );
}
