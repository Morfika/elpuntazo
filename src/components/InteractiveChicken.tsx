import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface CutData {
  id: string;
  name: string;
  description: string;
  usos: string[];
}

const chickenCuts: CutData[] = [
  { id: 'pescuezo', name: 'Pescuezo', description: 'Parte del cuello, con poco aporte de carne pero mucho sabor.', usos: ['Sopas', 'Caldos', 'Fondos'] },
  { id: 'pechuga', name: 'Pechuga', description: 'Corte magro y versátil, bajo en grasa y alto en proteína.', usos: ['A la plancha', 'Desmechada', 'Milanesa'] },
  { id: 'ala', name: 'Ala', description: 'Corte jugoso y perfecto para dorar. Favorito para snacks.', usos: ['Fritas', 'BBQ', 'Al horno'] },
  { id: 'muslo', name: 'Muslo (Colombina)', description: 'La parte inferior de la pierna. Carne oscura y muy jugosa.', usos: ['Frito', 'Guisado', 'Al horno'] },
  { id: 'contramuslo', name: 'Contramuslo', description: 'Parte superior de la pierna. Más carne y sabor que el muslo.', usos: ['Estofados', 'Arroces', 'Al horno'] },
  { id: 'rabadilla', name: 'Rabadilla', description: 'Parte trasera con hueso, ideal para dar sustancia a las preparaciones.', usos: ['Caldos', 'Sopas', 'Sancocho'] },
  { id: 'costillar', name: 'Costillar', description: 'Huesos de la espalda con carne adherida. Mucho sabor.', usos: ['Sopas', 'Caldos'] },
];

const InteractiveChicken = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedCut = chickenCuts.find(c => c.id === selected);

  const getColor = (cutId: string) => {
    if (selected === cutId) {
      return '#B45309'; // Amber oscuro seleccionado
    }
    return '#F59E0B'; // Amber normal
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
        <svg viewBox="0 0 1222 814" className="w-full" style={{ fontFamily: 'Montserrat, sans-serif' }}>

          {/* Pescuezo / Cuello */}
          <path
            d="M308.803 331.514C309.066 317.81 309.917 305.194 311.206 291.681L316.051 240.877C316.528 235.877 316.695 231.394 318.262 226.64C341.819 234.256 371.407 215.726 385.934 198.174C403.055 177.482 407.382 147.323 392.521 124.063C395.775 125.693 398.591 127.625 401.511 129.978C416.762 142.267 429.372 156.488 441.21 172.132L467.106 207.491C477.019 221.02 488.069 232.872 501.356 244.073C451.346 271.975 400.517 296.188 347.762 317.253C334.771 322.444 322.845 326.856 308.787 331.522L308.803 331.514Z"
            fill={getColor('pescuezo')}
            opacity={getOpacity('pescuezo')}
            onClick={() => setSelected(selected === 'pescuezo' ? null : 'pescuezo')}
            className="cursor-pointer transition-all duration-300 hover:opacity-100"
            stroke="#78350F" strokeWidth="2"
          />
          <path
            d="M305.906 242.26C300.664 243.802 295.946 241.545 291.849 239.407C283.885 235.249 276.987 229.216 273.861 220.583C271.013 212.713 273.184 203.699 278.467 197.18C281.092 193.945 283.829 191.218 286.86 187.919C286.367 186.147 285.373 183.571 284.497 181.687L268.045 180.956C254.998 180.376 246.756 177.959 231.695 178.985C233.851 162.999 252.261 148.539 266.47 142.919L268.483 137.617C260.901 136.194 255.101 131.933 253.796 124.85C252.698 118.888 256.652 114.405 262.373 114.087L269.024 113.714C258.769 110.725 251.879 103.499 250.67 92.8707C250.121 88.0932 250.24 76.9166 254.488 74.8259C255.364 74.3967 258.132 74.5318 259.023 75.0088L269.533 80.6845C266.549 74.3649 264.242 68.7766 266.247 62.6875C267.361 59.2852 270.177 55.8432 272.723 54.8098C283.821 50.3026 287.584 60.0881 292.485 67.4888L291.888 58.8401C291.451 52.5522 295.071 46.9242 300.298 45.1118C306.193 43.0688 312.812 44.2612 316.098 49.9131C318.46 53.9751 318.222 58.7049 318.986 63.8322L321.563 57.3536C323.465 52.5761 327.546 48.7366 331.587 47.6635C337.085 46.1929 342.988 46.6539 346.807 50.7557C351.572 55.875 350.84 63.0214 349.018 69.5636C354.142 63.3473 361.286 59.8655 368.749 63.2042C371.82 64.5794 374.588 67.457 375.328 70.0644C376.378 73.7687 375.193 76.9245 373.148 80.4222C380.316 78.6734 386.896 80.303 391.518 85.931C399.076 95.1362 397.517 108.777 388.606 116.583C365.558 101.686 332.892 98.3318 310.735 114.063C298.858 122.497 290.353 135.073 288.078 149.564C300.401 123.801 321.094 109.119 350.801 112.283C376.132 114.977 393.69 129.978 392.799 156.584C392.21 174.207 384.716 189.652 371.462 201.06C361.724 209.438 350.912 215.877 338.358 218.842C320.839 222.976 309.455 213.627 298.332 201.807C301.761 212.149 317.219 220.774 315.795 231.449C315.183 236.02 310.696 240.861 305.914 242.268L305.906 242.26Z"
            fill={getColor('pescuezo')}
            opacity={getOpacity('pescuezo')}
            onClick={() => setSelected(selected === 'pescuezo' ? null : 'pescuezo')}
            className="cursor-pointer transition-all duration-300 hover:opacity-100"
            stroke="#78350F" strokeWidth="2"
          />

          {/* Pechuga */}
          <path
            d="M444.765 454.48C424.748 473.614 385.145 491.405 358.58 480.617C352.057 475.307 346.949 469.425 341.929 462.597C316.057 427.429 307.855 385.926 308.579 342.476L339.097 331.562C377.292 316.768 414.151 300.687 451.257 281.728C450.644 293.183 451.511 303.31 454.423 314.145C443.182 315.949 433.229 320.202 424.398 327.182C413.244 336.8 406.903 349.98 405.448 364.718C402.273 398.637 421.152 431.149 444.765 454.472V454.48Z"
            fill={getColor('pechuga')}
            opacity={getOpacity('pechuga')}
            onClick={() => setSelected(selected === 'pechuga' ? null : 'pechuga')}
            className="cursor-pointer transition-all duration-300 hover:opacity-100"
            stroke="#78350F" strokeWidth="2"
          />
          <path
            d="M479.732 719.754C464.584 723.761 451.378 728.753 438.131 737.584C437.296 732.855 439.054 728.673 441.672 724.937C452.523 709.436 469.405 705.597 487.091 700.207C460.32 699.158 435.936 702.099 410.326 713.562C411.376 706.892 415.927 702.719 420.661 699.253C436.493 687.639 463.542 685.485 482.882 685.986L502.644 686.495L518.763 667.814C535.295 648.656 541.628 636.423 544.635 610.373C562.527 614.356 570.467 613.879 589.449 613.418L575.583 630.707C561.517 648.243 565.542 658.45 558.955 668.108C554.556 674.547 548.947 667.862 544.396 673.498C540.744 678.021 537.944 682.743 535.907 688.411C553.855 687.973 581.732 690.62 588.057 709.842C588.391 710.859 588.503 712.385 587.93 712.854C587.357 713.323 585.456 712.679 584.684 712.266C576.728 708.045 567.993 707.004 558.963 707.179C532.065 707.695 506.217 712.735 479.716 719.746L479.732 719.754Z"
            fill={getColor('pechuga')}
            opacity={getOpacity('pechuga')}
            onClick={() => setSelected(selected === 'pechuga' ? null : 'pechuga')}
            className="cursor-pointer transition-all duration-300 hover:opacity-100"
            stroke="#78350F" strokeWidth="2"
          />

          {/* Rabadilla / Cola */}
          <path
            d="M989.398 285.973C993.408 323.43 966.542 344.082 935.482 355.028C947.002 355.902 957.225 354.44 968.467 351.999C961.967 374.44 940.343 393.685 924.416 409.965C908.974 384.917 880.548 369.36 853.133 361.117C844.294 319.241 817.014 280.083 777.521 260.583C790.879 253.612 802.701 246.291 814.022 236.903C859.68 199.056 890.596 149.35 899.841 89.7466C906.245 93.3237 912.395 97.2665 917.614 102.044C930.415 113.467 935.22 129.151 932.085 145.852C928.871 162.967 921.488 177.895 911.767 192.291C929.866 178.857 941.425 160.956 949.604 140.407C957.615 148.38 961.362 158.046 962.818 168.492C966.534 197.745 946.525 228.421 928.012 248.5C950.169 237.451 967.091 220.988 981.833 201.25C990.345 216.314 992.692 233.294 989.216 249.733C983.129 276.975 951.879 299.399 927.471 311.252C949.874 308.74 971.363 300.242 989.391 285.973H989.398Z"
            fill={getColor('rabadilla')}
            opacity={getOpacity('rabadilla')}
            onClick={() => setSelected(selected === 'rabadilla' ? null : 'rabadilla')}
            className="cursor-pointer transition-all duration-300 hover:opacity-100"
            stroke="#78350F" strokeWidth="2"
          />

          {/* Muslo */}
          <path
            d="M664.79 731.765C644.28 738.761 626.698 746.63 611.335 763.697C606.872 743.165 630.899 726.209 647.582 720.04L659.627 715.589C642.053 715.533 625.202 717.552 608.567 722.64C602.25 724.571 596.673 727.656 589.99 730.112C592.274 721.042 598.837 715.008 606.482 710.779C627.533 699.142 652.292 700.7 676.668 700.811C685.085 686.503 696.223 670.707 701.164 654.467C702.954 645.111 703.701 636.073 703.614 626.375C718.324 625.365 731.881 621.303 745.851 614.499C740.306 627.384 734.784 639.221 732.04 652.671C729.717 664.07 731.467 669.563 727.958 679.603C725.293 687.234 717.974 679.897 714.426 685.938C711.705 690.573 709.819 695.517 708.578 700.763C726.542 699.921 760.704 704.197 762.55 727.155C757.371 724.961 753.059 722.679 748.23 721.559C722.994 715.708 689.055 723.482 664.774 731.765H664.79Z"
            fill={getColor('muslo')}
            opacity={getOpacity('muslo')}
            onClick={() => setSelected(selected === 'muslo' ? null : 'muslo')}
            className="cursor-pointer transition-all duration-300 hover:opacity-100"
            stroke="#78350F" strokeWidth="2"
          />

          {/* Ala */}
          <path
            d="M698.459 416.515C655.108 460.84 604.605 504.004 537.705 491.469C497.02 483.845 458.967 460.983 434.909 427.191C420.517 406.976 409.936 378.677 418.21 354.265C426.596 329.527 452.396 321.188 476.55 324.106C498.269 326.729 520.831 334.169 541.707 341.101C594.072 358.478 649.483 373.343 705.643 369.599L757.252 366.157C745.493 374.13 735.381 381.396 725.405 390.307L698.459 416.531V416.515Z"
            fill={getColor('ala')}
            opacity={getOpacity('ala')}
            onClick={() => setSelected(selected === 'ala' ? null : 'ala')}
            className="cursor-pointer transition-all duration-300 hover:opacity-100"
            stroke="#78350F" strokeWidth="2"
          />
          <path
            d="M610.738 350.624C591.151 346.061 572.264 340.211 553.043 333.843C525.015 324.559 493.439 313.247 464.249 313.374C461.051 300.95 460.216 288.986 462.022 276.593L508.069 252.396C515.548 248.381 541.531 254.947 551.134 256.06L569.639 259.2C592.241 263.04 614.278 266.227 637.708 268.429C628.774 283.112 622.616 297.826 617.89 313.684C614.668 325.719 612.56 337.071 610.738 350.632V350.624Z"
            fill={getColor('ala')}
            opacity={getOpacity('ala')}
            onClick={() => setSelected(selected === 'ala' ? null : 'ala')}
            className="cursor-pointer transition-all duration-300 hover:opacity-100"
            stroke="#78350F" strokeWidth="2"
          />

          {/* Contramuslo */}
          <path
            d="M882.704 489.99C879.45 521.946 846.538 549.299 820.188 561.851C805.359 568.918 798.644 565.134 785.207 556.35C767.211 544.585 752.087 530.07 737.918 513.845C718.108 491.158 703.04 465.331 693.438 436.484C719.341 410.76 758.428 365.545 797.18 364.146C825.312 363.128 852.838 369.265 877.668 382.111C891.654 389.345 903.835 398.661 913.087 411.197C917.932 417.763 918.712 425.212 915.975 432.851C906.023 460.625 881.598 484.052 861.359 499.028L882.704 489.99Z"
            fill={getColor('contramuslo')}
            opacity={getOpacity('contramuslo')}
            onClick={() => setSelected(selected === 'contramuslo' ? null : 'contramuslo')}
            className="cursor-pointer transition-all duration-300 hover:opacity-100"
            stroke="#78350F" strokeWidth="2"
          />
          <path
            d="M708.148 616.852C680.08 620.532 654.471 605.659 633.348 589.077C605.169 567.352 584.079 538.56 576.895 503.202C613.157 498.384 644.128 479.799 671.146 456.818L685.204 444.322C698.243 480.721 720.384 512.709 748.158 539.434C759.757 550.595 771.683 560.285 785.868 568.616C782.073 574.578 777.466 579.172 772.359 584.18C754.697 601.51 732.883 613.616 708.148 616.852Z"
            fill={getColor('contramuslo')}
            opacity={getOpacity('contramuslo')}
            onClick={() => setSelected(selected === 'contramuslo' ? null : 'contramuslo')}
            className="cursor-pointer transition-all duration-300 hover:opacity-100"
            stroke="#78350F" strokeWidth="2"
          />
          <path
            d="M606.411 602.893C568.167 608.314 524.65 604.896 499.048 571.867C458.593 558.775 416.38 539.943 384.86 510.626C379.267 505.213 374.255 500.125 369.553 493.702C400.461 495.769 430.04 481.723 452.189 461.699C483.916 488.686 524.857 504.799 566.855 504.068C573.744 542.566 596.585 572.861 626.642 596.653C619.561 599.856 613.348 601.454 606.419 602.901L606.411 602.893Z"
            fill={getColor('muslo')}
            opacity={getOpacity('muslo')}
            onClick={() => setSelected(selected === 'muslo' ? null : 'muslo')}
            className="cursor-pointer transition-all duration-300 hover:opacity-100"
            stroke="#78350F" strokeWidth="2"
          />

          {/* Costillar */}
          <path
            d="M754.579 355.664C707.346 360.473 667.336 361.864 620.779 352.492C623.882 322.683 632.617 294.042 649.301 269.796L677.424 270.536C706.16 271.291 734.236 269.447 763.036 265.957C773.386 269.049 782.209 274.145 790.761 280.607C803.443 289.892 813.913 300.942 822.481 314.169C831.336 327.5 838.066 341.459 842.012 358.112C810.834 351.371 786.29 352.977 754.579 355.672V355.664Z"
            fill={getColor('costillar')}
            opacity={getOpacity('costillar')}
            onClick={() => setSelected(selected === 'costillar' ? null : 'costillar')}
            className="cursor-pointer transition-all duration-300 hover:opacity-100"
            stroke="#78350F" strokeWidth="2"
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

              <h3 className="text-xl font-bold text-[#B45309] mb-2">{selectedCut.name}</h3>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">{selectedCut.description}</p>
              <div className="flex flex-wrap gap-2">
                {selectedCut.usos.map(uso => (
                  <span key={uso} className="px-3 py-1 rounded-full bg-[#B45309]/10 text-[#B45309] text-xs font-semibold">
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

export default InteractiveChicken;
