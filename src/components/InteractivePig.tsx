import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface CutData {
  id: string;
  name: string;
  description: string;
  usos: string[];
}

const pigCuts: CutData[] = [
  { id: 'cabeza', name: 'Cabeza', description: 'Incluye orejas y careta. Muy rica en colágeno y sabor.', usos: ['Sancocho', 'Frijoles', 'Queso de cabeza'] },
  { id: 'papada', name: 'Papada', description: 'Corte graso y muy sabroso situado bajo la cara.', usos: ['Chicharrón', 'Guisos', 'Papada curada'] },
  { id: 'brazuelo', name: 'Brazuelo', description: 'La pata delantera. Carne jugosa con hueso y grasa, ideal para hornear.', usos: ['Horneado', 'Guisos', 'Desmechada'] },
  { id: 'lomo', name: 'Lomo', description: 'El corte más magro y tierno del cerdo. Versátil y saludable.', usos: ['Chuletas', 'Asado', 'Milanesa'] },
  { id: 'costilla', name: 'Costilla', description: 'Huesos con carne tierna y sabrosa. Un clásico del BBQ.', usos: ['BBQ', 'Asado', 'Sancocho'] },
  { id: 'tocino', name: 'Tocino / Barriga', description: 'La panza del cerdo. Capas de carne y grasa perfectas.', usos: ['Chicharrón', 'Tocineta', 'Rollo'] },
  { id: 'pernil', name: 'Pernil', description: 'La pata trasera. Mucha carne, pulpa magra y piel para chicharrón.', usos: ['Asado entero', 'Pernil navideño', 'Jamón'] },
];

const InteractivePig = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedCut = pigCuts.find(c => c.id === selected);

  const getColor = (cutId: string) => {
    if (selected === cutId) {
      return '#E38C8C'; // Rosado intenso seleccionado
    }
    return '#EAA886'; // Rosado cerdo normal
  };

  const getOpacity = (cutId: string) => {
    if (selected === cutId) {
      return 1;
    }
    return 0.7;
  };

  return (
    <div className="w-full relative">
      <div className="max-w-lg mx-auto relative">
        <svg viewBox="0 0 1432 1024" className="w-full" style={{ fontFamily: 'Montserrat, sans-serif' }}>

          {/* Pernil / Pierna Trasera */}
          <path
            d="M1200.41 777.53C1184.17 776.71 1187.55 803.42 1189.83 814.64C1171.95 815.76 1154.08 815.89 1135.98 815.42C1129.05 815.24 1123.09 814.2 1116.68 811.44C1134.7 782.67 1151.29 769.34 1155.08 733.99C1156.81 717.87 1157.54 702.26 1157.34 686.02L1156.86 646.89C1156.68 632.47 1121.31 601.67 1109.87 592.22C1097.75 582.2 1086.58 572.71 1075.73 561.06C1034.68 516.97 1002.3 465.83 980.351 409.11C1000.88 396.58 1022.16 388.35 1044.64 381.61C1076.8 373.04 1109.1 369.28 1142.43 370.45C1185.11 371.81 1226.51 382.51 1264.04 403.15C1264.35 440.96 1255.89 476.89 1239.87 510.57C1231.6 527.95 1225.69 545.32 1220.5 563.67C1216.21 585.58 1217.55 588.99 1225.72 608.35C1230.42 619.49 1229.94 630.79 1224.72 641.7C1219.76 652.07 1215.06 662.12 1211.22 673.1C1202.2 698.91 1200.53 725.73 1206.65 752.34C1208.32 759.59 1211.85 778.09 1200.42 777.51L1200.41 777.53Z"
            fill={getColor('pernil')}
            opacity={getOpacity('pernil')}
            onClick={() => setSelected(selected === 'pernil' ? null : 'pernil')}
            className="cursor-pointer transition-all duration-300 hover:opacity-100"
            stroke="#8B4513" strokeWidth="2"
          />
          <path
            d="M1053.05 804.33L1004.05 804.17C997.891 804.15 992.391 803.37 985.851 802.87C995.261 787.59 1004.72 773.5 1015.06 758.99C1035.13 730.82 1039.92 709.1 1046.57 675.75C1048.06 668.29 1050.24 661.3 1053.15 654.41C1056.43 646.63 1055.23 638.71 1049.34 632.58C1040.77 623.66 1031.32 616.13 1021.53 608.41L994.421 587.02L1023.73 572.47C1034.71 567.02 1045.71 562.56 1058.32 560.35C1069.42 571.78 1079.55 583.13 1091.66 593.25L1114.04 611.94C1116.84 614.28 1119.84 618.21 1122.02 621.16C1123.46 639.08 1117.33 654.74 1106.52 668.52C1091.46 687.7 1084.5 710.61 1083.33 734.94C1082.72 747.66 1084.59 772.52 1069.07 770.94C1063.4 770.36 1059.62 773.73 1057.45 778.66C1055.03 786.7 1053.9 794.05 1053.06 804.33H1053.05Z"
            fill={getColor('pernil')}
            opacity={getOpacity('pernil')}
            onClick={() => setSelected(selected === 'pernil' ? null : 'pernil')}
            className="cursor-pointer transition-all duration-300 hover:opacity-100"
            stroke="#8B4513" strokeWidth="2"
          />
          <path
            d="M1248.42 301.25C1258.95 329.46 1263.76 359.44 1264.19 389.99C1226.74 369.52 1185.52 360.18 1143.91 358.28C1085.94 356.59 1027.84 367.58 977.111 397.04C959.931 346.92 948.981 283.5 964.291 232.4C968.841 217.79 975.461 204.81 985.001 193.12C991.001 185.77 998.461 181.85 1007.92 179.52C1044.59 170.5 1082.64 170.55 1119.55 179.36C1149.5 186.5 1176.44 200.25 1198.83 221.1C1214.39 235.58 1225.22 252.64 1234.86 271.35C1237.72 276.89 1246.16 279.08 1251.96 279.09C1238.4 262.35 1234.22 236.95 1252.09 223.28C1261.07 216.41 1272.41 215.13 1282.84 218.91C1295.13 223.36 1302.44 234.64 1300.75 247.92C1299.22 259.99 1292.12 269.97 1283.73 278.58C1298.69 283.96 1312.85 279.97 1325.08 269.94C1323.03 282.07 1313.1 290.31 1301.83 293.95C1290.36 297.65 1278.24 295.79 1267.45 291.33L1248.41 301.25H1248.42ZM1282.58 236.13C1278.1 232.16 1267.85 232.06 1262.32 236.81C1253.23 244.63 1258.75 262.11 1268.17 270.28C1277.96 264.82 1291.21 243.78 1282.57 236.13H1282.58Z"
            fill={getColor('pernil')}
            opacity={getOpacity('pernil')}
            onClick={() => setSelected(selected === 'pernil' ? null : 'pernil')}
            className="cursor-pointer transition-all duration-300 hover:opacity-100"
            stroke="#8B4513" strokeWidth="2"
          />

          {/* Lomo */}
          <path
            d="M782.381 191.08C766.571 238.21 763.161 284.08 764.171 334.52C705.881 343.02 647.781 348.05 587.181 348.3C579.091 293.8 579.111 241.86 569.131 186.74C597.791 183.99 625.571 184.04 654.081 185.52L756.081 190.85L782.391 191.08H782.381Z"
            fill={getColor('lomo')}
            opacity={getOpacity('lomo')}
            onClick={() => setSelected(selected === 'lomo' ? null : 'lomo')}
            className="cursor-pointer transition-all duration-300 hover:opacity-100"
            stroke="#8B4513" strokeWidth="2"
          />
          <path
            d="M871.621 477.2C846.511 482.25 823.061 486.21 797.911 488.83C786.511 441.38 779.521 393.92 776.921 344.89C834.071 336.24 890.411 332.5 948.271 334.92C954.191 374.04 966.231 410.91 982.841 447.19C946.251 459.37 909.881 469.06 871.611 477.2H871.621Z"
            fill={getColor('lomo')}
            opacity={getOpacity('lomo')}
            onClick={() => setSelected(selected === 'lomo' ? null : 'lomo')}
            className="cursor-pointer transition-all duration-300 hover:opacity-100"
            stroke="#8B4513" strokeWidth="2"
          />
          <path
            d="M776.891 332.68C775.401 286.25 778.871 235.6 795.761 191.13C835.421 190.72 874.241 188.34 913.951 184.58C937.011 182.4 958.86 180.33 982.45 179.68C945.29 216.94 940.331 272.68 946.711 322.5C890.091 320.6 834.121 324.1 776.881 332.68H776.891Z"
            fill={getColor('lomo')}
            opacity={getOpacity('lomo')}
            onClick={() => setSelected(selected === 'lomo' ? null : 'lomo')}
            className="cursor-pointer transition-all duration-300 hover:opacity-100"
            stroke="#8B4513" strokeWidth="2"
          />

          {/* Costilla / Tocino */}
          <path
            d="M903.211 604.92C880.781 610.48 859.691 614.24 837.351 616.77C822.811 578.49 810.881 540.61 800.721 500.88C865.141 493.06 926.721 478.98 988.301 458.21C1005.36 491.34 1025.55 521.49 1049.53 550.26C1036.02 554.29 1023.79 558.88 1011.32 565.26C976.881 582.89 941.501 596.06 903.211 604.91V604.92Z"
            fill={getColor('tocino')}
            opacity={getOpacity('tocino')}
            onClick={() => setSelected(selected === 'tocino' ? null : 'tocino')}
            className="cursor-pointer transition-all duration-300 hover:opacity-100"
            stroke="#8B4513" strokeWidth="2"
          />
          <path
            d="M824.391 617.79C759.341 624.14 693.991 613.71 630.471 598.84C642.651 562.64 643.931 525.58 627.631 489.2L674.101 496.91C711.841 503.17 749.541 504.64 788.121 501.59C798.201 541.48 810.001 579.69 824.391 617.8V617.79Z"
            fill={getColor('costilla')}
            opacity={getOpacity('costilla')}
            onClick={() => setSelected(selected === 'costilla' ? null : 'costilla')}
            className="cursor-pointer transition-all duration-300 hover:opacity-100"
            stroke="#8B4513" strokeWidth="2"
          />

          {/* Brazuelo */}
          <path
            d="M677.531 485.07L621.461 475.75C614.961 461.1 609.721 446.98 605.031 431.88C598.151 408.13 592.72 384.67 588.98 360.32C648.09 359.8 705.43 355 764.63 346.44C767.12 394.81 774.141 441.56 785.151 489.62C749.281 492.85 714.071 490.59 677.531 485.07Z"
            fill={getColor('brazuelo')}
            opacity={getOpacity('brazuelo')}
            onClick={() => setSelected(selected === 'brazuelo' ? null : 'brazuelo')}
            className="cursor-pointer transition-all duration-300 hover:opacity-100"
            stroke="#8B4513" strokeWidth="2"
          />
          <path
            d="M578.871 778.12C571.251 782.73 577.881 806.75 579.791 814.74L515.891 815.56C510.941 815.62 506.381 814.4 501.261 813.14L520.611 785.61C533.891 766.71 541.071 745.38 542.301 722.21C543.851 693.14 542.411 664.92 537.851 636.18C535.501 621.37 531.451 607.98 525.541 594.35C518.851 578.9 509.481 566.21 498.241 553.77C478.451 531.87 460.601 498.16 461.621 468.06C461.911 459.43 465.171 452.15 471.821 446.59C517.861 408.1 584.981 418.3 598.851 451.95L612.941 486.13C620.071 503.43 626.601 520.07 627.421 539.12C628.821 571.99 618.581 597.84 607.021 627.84C590.911 669.65 579.621 703.55 591.981 748.11C593.681 754.24 595.781 772.46 591.511 776.46C588.771 779.03 583.221 775.5 578.871 778.13V778.12Z"
            fill={getColor('brazuelo')}
            opacity={getOpacity('brazuelo')}
            onClick={() => setSelected(selected === 'brazuelo' ? null : 'brazuelo')}
            className="cursor-pointer transition-all duration-300 hover:opacity-100"
            stroke="#8B4513" strokeWidth="2"
          />
          <path
            d="M493.841 774.84C482.701 778.02 483.041 791.69 486.431 803.06C464.051 803.7 441.981 803.84 418.431 802.12C428.881 780.66 441.901 769.05 454.501 750.48C465.491 723.02 465.171 700.2 464.721 670.97C464.401 649.53 460.781 629.34 453.351 609.35C448.001 594.97 438.331 569.25 440.031 553.36C458.441 573.67 480.141 582.13 507.131 584.83C518.431 603.59 524.781 624.64 527.051 646.74L518.611 674.37C505.621 716.89 510.731 742.03 504.501 764.32C502.961 769.83 499.121 773.34 493.831 774.85L493.841 774.84Z"
            fill={getColor('brazuelo')}
            opacity={getOpacity('brazuelo')}
            onClick={() => setSelected(selected === 'brazuelo' ? null : 'brazuelo')}
            className="cursor-pointer transition-all duration-300 hover:opacity-100"
            stroke="#8B4513" strokeWidth="2"
          />

          {/* Cabeza */}
          <path
            d="M415.751 298.83C392.151 276.93 378.371 280.03 349.251 271.87C341.171 269.61 333.671 266 328.521 259.21C377.441 237.05 425.771 218.68 476.321 204.3C503.011 196.71 529.311 191.31 556.881 187.81C557.351 208.64 554.431 228.12 548.831 247.55C541.201 272 527.621 292.7 508.381 309.54C489.131 326.29 467.351 338.57 443.151 347.76C440.101 328.32 430.151 312.2 415.741 298.82L415.751 298.83Z"
            fill={getColor('cabeza')}
            opacity={getOpacity('cabeza')}
            onClick={() => setSelected(selected === 'cabeza' ? null : 'cabeza')}
            className="cursor-pointer transition-all duration-300 hover:opacity-100"
            stroke="#8B4513" strokeWidth="2"
          />
          <path
            d="M228.63 505.48C224.29 504.14 220.51 501.6 216.73 498.09C236.59 497.51 254.46 487.78 265.76 471.69C239.88 488.74 205.32 488.06 176.05 485.15C152.43 483.02 141.72 447.33 140.22 428.15C139.98 425.05 141.8 420.76 144.87 420.85C152.36 421.07 158.37 419.59 165.24 417.1C183.46 410.51 200.65 402.28 214.94 388.92C229.23 375.56 239.28 354.19 252.42 338.36C254.3 323.73 260.56 310.69 271.67 300.68C250.88 292.37 221.93 279.36 214.56 255.6C258.91 247.06 292.94 246.23 329.16 275.71C337.87 282.8 345.86 290 351.17 299.96C355.3 307.71 355.41 316.14 356.41 325.2C359.56 312.23 359.88 298.96 354.29 286.04C367.76 287.25 381.04 289.66 392.8 296.13C418.43 310.22 432.41 336.04 432.28 365.03C432.17 389.27 430.01 412.49 422.58 435.59C415.89 456.38 404.93 477.74 387.97 491.83C376.8 501.11 365.36 509.16 352.3 515.51C330.12 526.3 301.66 524.23 278.02 518.91C261.15 515.12 245.12 510.57 228.63 505.47V505.48Z"
            fill={getColor('cabeza')}
            opacity={getOpacity('cabeza')}
            onClick={() => setSelected(selected === 'cabeza' ? null : 'cabeza')}
            className="cursor-pointer transition-all duration-300 hover:opacity-100"
            stroke="#8B4513" strokeWidth="2"
          />
          <path
            d="M251.991 301.72C248.381 309.32 245.711 317.01 244.031 325.04C243.511 327.53 241.031 332.84 237.941 332.83C206.751 332.68 180.291 310.57 173.451 280.5C172.861 277.91 173.371 274.34 173.801 271.92C187.841 279.72 199.611 278.41 215.181 279.06C229.491 292.03 233.041 293.67 251.981 301.71L251.991 301.72Z"
            fill={getColor('cabeza')}
            opacity={getOpacity('cabeza')}
            onClick={() => setSelected(selected === 'cabeza' ? null : 'cabeza')}
            className="cursor-pointer transition-all duration-300 hover:opacity-100"
            stroke="#8B4513" strokeWidth="2"
          />

          {/* Papada */}
          <path
            d="M450.32 463.28C447.08 498.53 472.18 545.99 498.04 571.75C464.96 567.59 443.41 546.23 432.75 515.09C428.37 502.29 422.98 490.46 416.32 478.76C437.91 445.63 445.81 399.61 444.31 360.31C502.85 339.04 549.24 302.35 563.72 239.57L566.84 267.1C570.47 321.53 575.75 370.58 590.41 424.56C553.18 398.48 501.6 410.62 468.19 434.1C458.04 441.24 451.46 450.9 450.32 463.29V463.28Z"
            fill={getColor('papada')}
            opacity={getOpacity('papada')}
            onClick={() => setSelected(selected === 'papada' ? null : 'papada')}
            className="cursor-pointer transition-all duration-300 hover:opacity-100"
            stroke="#8B4513" strokeWidth="2"
          />
          <path
            d="M437.94 549.49C410.84 545.24 386.49 536.66 363.94 522.25L387.33 507.28C395.06 502.34 401.21 496.63 408.38 489.63C421.32 510.25 423.53 528.28 437.94 549.49Z"
            fill={getColor('papada')}
            opacity={getOpacity('papada')}
            onClick={() => setSelected(selected === 'papada' ? null : 'papada')}
            className="cursor-pointer transition-all duration-300 hover:opacity-100"
            stroke="#8B4513" strokeWidth="2"
          />

        </svg>

        {/* Detail panel */}
        <AnimatePresence>
          {selectedCut && (
            <motion.div
              key={selectedCut.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200 max-w-md w-[90%] z-20"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(null);
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
                aria-label="Cerrar"
              >
                <X size={24} />
              </button>

              <h3 className="text-xl font-bold text-[#8B4513] mb-2">{selectedCut.name}</h3>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">{selectedCut.description}</p>
              <div className="flex flex-wrap gap-2">
                {selectedCut.usos.map(uso => (
                  <span key={uso} className="px-3 py-1 rounded-full bg-[#8B4513]/10 text-[#8B4513] text-xs font-semibold">
                    {uso}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InteractivePig;
