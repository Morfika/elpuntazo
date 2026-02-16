import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface CutData {
  id: string;
  name: string;
  description: string;
  usos: string[];
}

const cowCuts: CutData[] = [
  { id: 'cogote', name: 'Cogote', description: 'Carne con mucho sabor, ideal para preparaciones lentas y guisos tradicionales.', usos: ['Carne molida', 'Guisos', 'Sopas'] },
  { id: 'lomo', name: 'Lomo', description: 'El corte más tierno y apreciado. Perfecto para preparaciones rápidas a alta temperatura.', usos: ['Filetes', 'Asado', 'A la plancha'] },
  { id: 'cadera', name: 'Cadera', description: 'Carne magra y versátil, excelente para bistec y preparaciones del día a día.', usos: ['Bistec', 'Asados', 'Sudado'] },
  { id: 'pecho', name: 'Pecho', description: 'Corte con hueso y grasa que aporta sabor profundo a las sopas.', usos: ['Sopas', 'Caldos', 'Estofados'] },
  { id: 'costilla', name: 'Costilla', description: 'Ideal para asar, el hueso le da un sabor incomparable.', usos: ['Asado', 'BBQ', 'Sopas'] },
  { id: 'falda', name: 'Falda', description: 'Carne fibrosa que se deshace con cocción lenta. Muy jugosa.', usos: ['Desmechada', 'Estofados', 'Sudado'] },
  { id: 'murillo', name: 'Murillo', description: 'Carne magra del brazo, excelente para moler. Gran textura.', usos: ['Carne molida', 'Guisos', 'Albóndigas'] },
  { id: 'sobrebarriga', name: 'Sobrebarriga', description: 'Corte emblemático colombiano, jugoso y lleno de sabor.', usos: ['Al horno', 'Sudado', 'Rellena'] },
  { id: 'pierna', name: 'Centro Pierna', description: 'Carne magra y tierna. Uno de los cortes más versátiles.', usos: ['Sudado', 'Asado', 'Milanesa'] },
];

const InteractiveCow = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedCut = cowCuts.find(c => c.id === selected);

  const getColor = (cutId: string) => {
    if (selected === cutId) {
      return '#8B2020'; // Rojo oscuro cuando está seleccionado
    }
    return '#8B4513'; // Marrón normal
  };

  const getOpacity = (cutId: string) => {
    if (selected === cutId) {
      return 1;
    }
    return 0.7;
  };

  return (
    <>
      <div className="w-full relative">
        <div className="max-w-lg mx-auto relative">
          <svg viewBox="0 0 1112 765" className="w-full" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {/* Pata trasera derecha */}
            <path
              d="M1021.53 720.05C1011.61 724.11 1020.63 759.92 1020.63 759.92C1020.63 759.92 1021.09 760.29 1015.13 764.24L965.179 763.89C961.759 763.87 958.289 763.27 954.749 762.29C954.889 759.37 955.719 755.06 957.169 752.61L973.939 724.23C979.029 715.62 982.449 706.45 984.339 696.28C991.989 655.15 992.479 590.7 970.839 553.55C953.649 524.04 914.019 478.47 890.349 451.93C842.989 398.85 823.879 344.1 816.369 273.83C819.689 271.78 822.589 269.94 826.369 268.44C881.569 246.43 942.609 243.44 999.589 260.73C1021.24 267.3 1040.59 276.23 1058.87 289.33C1055.56 308.62 1051.28 326.92 1046.66 345.92L1034.94 394.16C1029.22 424.63 1019.38 467.72 1037.05 495.23C1047.76 511.9 1057.34 528.65 1049.67 547.9C1045.66 557.97 1042.75 567.89 1040.35 578.47L1031.08 619.24C1028.3 631.46 1026.94 643.68 1026.41 656.2C1025.13 686.2 1041.03 694.99 1038.56 713.68C1038.31 715.56 1037.23 718.2 1036.18 719.16C1032.81 722.26 1026.71 717.93 1021.54 720.05H1021.53Z"
              fill={getColor('pierna')}
              opacity={getOpacity('pierna')}
              onClick={() => setSelected(selected === 'pierna' ? null : 'pierna')}
              className="cursor-pointer transition-all duration-300 hover:opacity-100"
              stroke="#2c2c2c"
              strokeWidth="2"
            />

            {/* Pata trasera izquierda */}
            <path
              d="M902.589 746.29C902.355 744.29 902.12 743.29 903.089 747.79L850.039 748.29C845.849 748.3 841.599 747.57 837.139 747.24C838.819 737.59 843.489 729.57 849.919 722.07C867.169 701.94 880.949 679.85 889.189 654.43C895.959 633.56 900.039 611.77 895.019 590.4L891.089 570.29C890.089 565.29 862.529 458.82 868.089 457.29C880.529 453.86 913.589 485.29 922.089 498.79L940.089 522.79C949.679 534.79 957.149 548.73 965.369 562.18C957.159 574.9 951.389 587.16 944.999 600.34C907.969 676.71 927.989 690.09 921.809 705.91C920.189 710.06 916.379 711.78 912.129 711.09C905.139 709.96 899.869 714.62 899.369 721.85C898.889 728.75 900.339 736.1 902.019 742.72C901.021 738.79 901.423 740.29 902.589 745.29V746.29Z"
              fill={getColor('pierna')}
              opacity={getOpacity('pierna')}
              onClick={() => setSelected(selected === 'pierna' ? null : 'pierna')}
              className="cursor-pointer transition-all duration-300 hover:opacity-100"
              stroke="#2c2c2c"
              strokeWidth="2"
            />

            {/* Cabeza */}
            <path
              d="M158.059 282.46C147.149 275.4 139.309 290.44 104.119 282.3C94.079 279.98 80.389 276.15 72.879 282.94C59.819 294.75 35.569 289.46 24.779 275.53C11.299 274.81 2.03898 255.99 0.258984 245.2C-1.19102 236.35 3.57899 228.96 11.279 225.65C18.979 222.34 24.719 216.39 29.249 209.33C45.319 184.21 60.379 161.02 66.799 131.13C68.589 122.82 69.879 114.62 74.309 107.34C79.749 98.3801 87.489 91.5901 95.409 84.8401C96.529 67.7201 99.759 60.9801 116.429 52.9801C107.299 45.7001 98.599 38.5201 92.609 28.7101C79.749 7.65009 86.139 -5.21991 90.889 2.04009C99.799 15.6401 113.749 25.4701 129.369 30.9901C136.029 33.3401 142.419 35.6501 148.689 38.4701C161.219 44.1201 166.879 56.3501 164.759 69.7101C163.509 77.6301 161.669 85.1201 161.369 93.7201C167.749 71.9401 180.199 53.8501 201.099 44.3601C206.699 41.8201 216.659 38.4301 219.539 45.9501C223.039 55.1101 223.499 64.5501 222.269 74.3101C220.969 87.8701 216.949 100.35 208.969 111.31C199.669 123.84 186.909 131.05 171.779 136.82C189.079 136.28 205.319 129.62 217.409 115.9C219.899 142.49 217.359 167.78 212.159 193.41C204.769 229.85 190.939 259.78 167.229 288.42L158.049 282.48L158.059 282.46Z"
              fill={getColor('cogote')}
              opacity={getOpacity('cogote')}
              onClick={() => setSelected(selected === 'cogote' ? null : 'cogote')}
              className="cursor-pointer transition-all duration-300 hover:opacity-100"
              stroke="#2c2c2c"
              strokeWidth="2"
            />

            {/* Cadera - parte trasera superior */}
            <path
              d="M1070.8 328.85L1074.49 269.21C1076.29 240.08 1076.21 211.73 1072.3 182.92C1068.65 156 1056.69 125.15 1032.98 110.48C1028.82 107.91 1025.15 105.58 1019.14 106.2L1028.52 117.26C1028.52 117.26 1036.38 130.09 1041.23 137.1C1069.98 178.66 1066.83 230.29 1060.33 278.15C1051.04 273.29 1043.47 268.3 1034.3 264.1C966.969 233.23 884.879 231.94 815.689 262.89L813.319 223.29C812.089 202.73 812.249 182.9 812.789 162.34C813.149 148.69 814.149 135.8 818.919 123.14C823.689 110.48 831.129 98.08 843.229 90.5C847.709 87.69 854.439 87.02 859.709 86.81C882.699 85.92 904.159 80.87 926.269 74.62C963.969 63.98 1006.91 60.64 1042.01 80.2C1058.92 89.62 1071.74 103.2 1079.82 120.67C1084.59 130.98 1088.48 141.67 1090.23 153.05C1093.22 172.48 1095.11 191.47 1094.8 211.32C1094.27 244.78 1091 277 1087.74 310.23C1083.71 351.28 1082.27 383.89 1099.79 421.59C1108.45 440.23 1111.23 459.91 1107.86 480.23C1106.3 489.65 1106.88 498.63 1109.62 507.67C1111.08 512.48 1112.38 516.96 1111.84 522.47C1106.23 512.73 1102.42 506.36 1097.6 494.43C1097.76 494.36 1096.84 494.75 1095.99 495.11C1094.83 512.4 1097.62 528.36 1106.85 543.57C1097.22 539.76 1091.18 531.91 1085.91 523.17C1073.84 503.15 1078.32 480.94 1077.53 476.07C1077.48 475.79 1077.26 475.56 1077.05 475.77C1071.16 481.69 1070.54 502.71 1070.91 513.09C1054.2 470.83 1079.35 445.8 1073.93 404.26C1070.65 379.14 1069.18 354.85 1070.79 328.84L1070.8 328.85Z"
              fill={getColor('cadera')}
              opacity={getOpacity('cadera')}
              onClick={() => setSelected(selected === 'cadera' ? null : 'cadera')}
              className="cursor-pointer transition-all duration-300 hover:opacity-100"
              stroke="#2c2c2c"
              strokeWidth="2"
            />

            {/* Cadera/Lomo superior */}
            <path
              d="M747.489 504.98C720.049 517.11 692.669 525.01 663.239 528.01L659.509 487.45L651.569 406.64C711.359 386 762.599 360.18 813.669 321.29C814.959 324.78 815.989 327.99 816.869 331.77C826.409 373.11 844.729 410.46 872.109 444.56C845.339 451 821.939 461.06 799.699 475.8C782.849 486.97 766.139 496.12 747.489 504.97V504.98Z"
              fill={getColor('cadera')}
              opacity={getOpacity('cadera')}
              onClick={() => setSelected(selected === 'cadera' ? null : 'cadera')}
              className="cursor-pointer transition-all duration-300 hover:opacity-100"
              stroke="#2c2c2c"
              strokeWidth="2"
            />

            {/* Lomo central */}
            <path
              d="M756.189 349.07C722.299 368.55 688.019 384.56 651.029 396.92C646.359 338.87 644.129 281.78 645.659 222.93C675.679 219.12 704.399 215.78 733.999 213.9C757.759 213.06 780.319 213.09 803.769 217.43C805.279 248.72 807.419 279.15 812.249 310.34C794.519 325.01 776.319 337.09 756.189 349.08V349.07Z"
              fill={getColor('lomo')}
              opacity={getOpacity('lomo')}
              onClick={() => setSelected(selected === 'lomo' ? null : 'lomo')}
              className="cursor-pointer transition-all duration-300 hover:opacity-100"
              stroke="#2c2c2c"
              strokeWidth="2"
            />

            {/* Costilla superior */}
            <path
              d="M747.619 203.78L719.059 205.11L645.919 213.35C646.849 182.75 649.679 152.84 654.569 122.98C655.859 115.11 657.919 108.07 660.549 100.45L763.029 89.6202C786.019 87.1902 807.809 86.3702 831.549 86.8102C818.099 100.55 809.419 116.47 806.149 135.36L803.399 157.52L803.239 207.76C784.459 204.79 766.779 203.52 747.619 203.78Z"
              fill={getColor('costilla')}
              opacity={getOpacity('costilla')}
              onClick={() => setSelected(selected === 'costilla' ? null : 'costilla')}
              className="cursor-pointer transition-all duration-300 hover:opacity-100"
              stroke="#2c2c2c"
              strokeWidth="2"
            />

            {/* Pecho/Falda */}
            <path
              d="M636.409 234.92L618.019 235.59L540.159 235.44L517.609 234.82L424.699 229.62L424.429 182.66C424.269 155.28 422.279 128.55 419.189 101.33L416.499 89.9199L495.139 95.4299C523.979 97.4499 551.669 100.57 580.459 100.64L640.849 100.77L649.999 100.59C647.939 110.12 645.739 118.63 644.289 128.48C639.109 163.78 636.499 198.27 636.399 234.92H636.409Z"
              fill={getColor('pecho')}
              opacity={getOpacity('pecho')}
              onClick={() => setSelected(selected === 'pecho' ? null : 'pecho')}
              className="cursor-pointer transition-all duration-300 hover:opacity-100"
              stroke="#2c2c2c"
              strokeWidth="2"
            />

            {/* Falda/Sobrebarriga */}
            <path
              d="M577.329 411.87C558.829 413.97 541.779 413.56 523.749 412.85C500.329 411.02 477.639 407.47 454.279 402.95C427.659 350.06 424.649 297.4 424.529 238.88C495.949 244.74 565.109 246.05 636.209 244.53L636.609 293.96C636.889 328.92 638.899 362.97 642.239 398.71C621.349 405.37 599.959 409.35 577.339 411.87H577.329Z"
              fill={getColor('sobrebarriga')}
              opacity={getOpacity('sobrebarriga')}
              onClick={() => setSelected(selected === 'sobrebarriga' ? null : 'sobrebarriga')}
              className="cursor-pointer transition-all duration-300 hover:opacity-100"
              stroke="#2c2c2c"
              strokeWidth="2"
            />

            {/* Murillo/Brazuelo */}
            <path
              d="M229.521 100.109C254.638 104.001 278.913 104.771 304.239 101.803C309.261 164.068 296.736 228.344 274.958 285.123C262.838 316.703 248.837 346.859 234.554 377.12C217.445 345.444 202.022 319.063 176.155 294.412C191.276 276.369 203.132 256.88 211.354 234.763C225.947 195.508 232.712 149.539 227.055 107.6C226.885 106.34 227.056 104.653 227.594 103.108C228.063 101.76 228.744 100.712 229.521 100.109Z"
              fill={getColor('murillo')}
              opacity={getOpacity('murillo')}
              onClick={() => setSelected(selected === 'murillo' ? null : 'murillo')}
              className="cursor-pointer transition-all duration-300 hover:opacity-100"
              stroke="#2c2c2c"
              strokeWidth="2"
            />

            {/* Costilla inferior */}
            <path
              d="M417.57 297.28C404.96 302.4 393.33 305.31 380.15 307.45C351.8 312.05 308.79 308.09 285.77 286.94C295.47 260.73 302.95 234.93 308.36 207.46C314.91 171.17 317.56 136.92 314.57 99.4002C344.44 94.0302 374.72 90.9102 406.1 89.9102C409.27 98.2802 411.04 106.29 411.66 114.9L414.55 155.02L415.02 165.27L415.51 180.36C416.68 216.53 415.11 252.05 417.07 288.14L417.57 297.27V297.28Z"
              fill={getColor('costilla')}
              opacity={getOpacity('costilla')}
              onClick={() => setSelected(selected === 'costilla' ? null : 'costilla')}
              className="cursor-pointer transition-all duration-300 hover:opacity-100"
              stroke="#2c2c2c"
              strokeWidth="2"
            />

            {/* Pata delantera izquierda */}
            <path
              d="M372.179 744.66L310.169 744.79C310.339 739.3 310.969 734.03 314.029 730.39C343.169 695.73 353.399 637.09 342.079 593.23L323.929 522.91C334.979 525.96 344.759 528.21 356.019 529.61C365.429 556.76 367.629 580.04 380.919 606.15C375.089 632.22 376.299 658.01 384.149 683.29C385.909 688.95 386.599 709.7 376.439 707.91C374.389 707.55 369.499 707.61 368.479 709.31C363.999 716.77 364.579 725.33 367.589 732.88L372.439 745.06L385.759 721.83C403.249 691.34 401.329 633.93 388.279 601.05C382.799 587.23 377.399 574.81 374.039 560.28C369.489 540.57 365.709 520.79 356.989 502.67L344.919 477.59C335.949 458.95 334.259 438.32 332.549 416.67L358.359 412.54C388.209 407.76 415.379 405.32 445.989 409.39C461.389 438.24 460.529 473.03 455.539 504.72L448.449 549.69C446.339 563.08 446.249 576.09 447.769 589.52C450.439 613.16 436.099 610.28 434.359 645.74C432.429 684.94 446.469 696.38 443.929 715.03C442.629 724.58 433.419 717.81 429.129 721.61C422.619 727.39 429.679 745.43 432.719 752.82C417.589 769.79 430.228 746.395 432.719 752.82C432.719 752.82 431.589 754.29 430.589 755.79C426.479 751.59 430.089 754.79 430.589 755.79C429.619 758.53 429.529 761.14 426.959 761.13L385.049 761.03C379.779 761.02 375.029 760.24 369.429 759.7C369.339 754.63 370.259 750.13 372.189 744.66H372.179Z"
              fill={getColor('murillo')}
              opacity={getOpacity('murillo')}
              onClick={() => setSelected(selected === 'murillo' ? null : 'murillo')}
              className="cursor-pointer transition-all duration-300 hover:opacity-100"
              stroke="#2c2c2c"
              strokeWidth="2"
            />

            {/* Falda inferior */}
            <path
              d="M442.069 399.21C412.569 396.7 383.689 398.81 354.749 403.77C318.659 409.96 287.639 410.25 253.379 396.99C248.739 395.19 244.559 392.91 240.329 390.02L282.299 296.53C290.399 301.71 298.339 306.28 307.109 310.28C344.859 322.38 380.539 321.35 418.409 307C420.869 327.86 424.279 347.63 429.969 367.41L442.059 399.21H442.069Z"
              fill={getColor('falda')}
              opacity={getOpacity('falda')}
              onClick={() => setSelected(selected === 'falda' ? null : 'falda')}
              className="cursor-pointer transition-all duration-300 hover:opacity-100"
              stroke="#2c2c2c"
              strokeWidth="2"
            />

            {/* Pata delantera derecha */}
            <path
              d="M344.509 497.95C348.159 505.12 351.079 511.75 352.969 519.63C345.229 519.1 339.879 517.78 333.479 515.88C303.449 508.65 278.599 489.76 263.969 462.45C253.989 444.04 248.119 424.52 244.829 403.52C270.229 414.35 296.449 417.81 323.209 416.79C326.179 446.41 330.589 472.51 344.509 497.95Z"
              fill={getColor('murillo')}
              opacity={getOpacity('murillo')}
              onClick={() => setSelected(selected === 'murillo' ? null : 'murillo')}
              className="cursor-pointer transition-all duration-300 hover:opacity-100"
              stroke="#2c2c2c"
              strokeWidth="2"
            />

            {/* Barriga/Pecho inferior */}
            <path
              d="M464.349 510.13C469.219 475.35 470.459 447.23 458.259 413.4L505.949 420.45C523.089 422.04 538.919 423.17 556.189 422.77C585.309 421.31 613.529 416.57 642.639 408.58L654.349 527.47C649.849 529.07 645.209 529.21 639.979 528.89C599.349 529.51 559.809 526.05 519.909 518.38C501.229 514.79 483.329 511.42 464.349 510.12V510.13Z"
              fill={getColor('pecho')}
              opacity={getOpacity('pecho')}
              onClick={() => setSelected(selected === 'pecho' ? null : 'pecho')}
              className="cursor-pointer transition-all duration-300 hover:opacity-100"
              stroke="#2c2c2c"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      {/* Detail panel - Modal centrado en pantalla completa (fuera del contenedor relativo) */}
      <AnimatePresence>
        {selectedCut && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            />

            {/* Modal */}
            <motion.div
              key={selectedCut.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200 max-w-md w-[90%] z-50"
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

              <h3 className="text-xl font-bold text-[#540D0D] mb-2">{selectedCut.name}</h3>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">{selectedCut.description}</p>
              <div className="flex flex-wrap gap-2">
                {selectedCut.usos.map(uso => (
                  <span key={uso} className="px-3 py-1 rounded-full bg-[#540D0D]/10 text-[#540D0D] text-xs font-semibold">
                    {uso}
                  </span>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default InteractiveCow;
