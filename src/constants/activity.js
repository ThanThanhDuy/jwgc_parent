import milk from "../assets/activity/feeding-bottle.png";
import milkde from "../assets/activity/feeding-bottle_de.png";
import sleep from "../assets/activity/sleeping.png";
import sleep_de from "../assets/activity/sleeping_de.png";
import play from "../assets/activity/blocks.png";
import play_de from "../assets/activity/blocks_de.png";
import health from "../assets/activity/stethoscope.png";
import health_de from "../assets/activity/stethoscope_de.png";
import growth from "../assets/activity/growth-chart.png";
import growth_de from "../assets/activity/growth-chart_de.png";
import breastPump from "../assets/activity/breast-pump.png";
import breastPump_de from "../assets/activity/breast-pump_de.png";
import diaper from "../assets/activity/diaper.png";
import diaper_de from "../assets/activity/diaper_de.png";
import diary from "../assets/activity/diary.png";
import diary_de from "../assets/activity/diary_de.png";

export const ACTIVITY = [
  {
    title: "Cho Ăn",
    color: "#ff7ba7",
    icon: milk,
    iconde: milkde,
  },
  {
    title: "Ngủ",
    color: "#bb98ff",
    icon: sleep,
    iconde: sleep_de,
  },
  {
    title: "Giờ Chơi",
    color: "#00d677",
    icon: play,
    iconde: play_de,
  },
  {
    title: "Sức Khỏe",
    color: "#00c2bd",
    icon: health,
    iconde: health_de,
  },
  {
    title: "Tăng Trưởng",
    color: "#ee7e61",
    icon: growth,
    iconde: growth_de,
  },
  {
    title: "Vắt Sữa",
    color: "#79b9ff",
    icon: breastPump,
    iconde: breastPump_de,
  },
  {
    title: "Thay Tã",
    color: "#ff4974",
    icon: diaper,
    iconde: diaper_de,
  },
  {
    title: "Nhật Ký",
    color: "#ffc300",
    icon: diary,
    iconde: diary_de,
  },
];

export const COLOR_DIAPER = [
  "#e6b500",
  "#66370b",
  "#b2ac34",
  "#006831",
  "#d5001a",
  "#1d1210",
];

export const LIST_SYMPTOM = [
  {
    label: "Không triệu chứng",
    value: "Không triệu chứng",
  },
  {
    label: "Lo lắng",
    value: "Lo lắng",
  },
  {
    label: "Mệt mỏi",
    value: "Mệt mỏi",
  },
  {
    label: "Sốt",
    value: "Sốt",
  },
  {
    label: "Cáu kỉnh",
    value: "Cáu kỉnh",
  },
  {
    label: "Chán ăn",
    value: "Chán ăn",
  },
  {
    label: "Khác",
    value: "Khác",
  },
  {
    label: "Mắt ngứa",
    value: "Mắt ngứa",
  },
  {
    label: "Mắt đỏ",
    value: "Mắt đỏ",
  },
  {
    label: "Mắt ướt",
    value: "Mắt ướt",
  },
  {
    label: "Sưng mí mắt",
    value: "Sưng mí mắt",
  },
  {
    label: "Chảy mủ tai",
    value: "Chảy mủ tai",
  },
  {
    label: "Tai ngứa",
    value: "Tai ngứa",
  },
  {
    label: "Tai đỏ",
    value: "Tai đỏ",
  },
  {
    label: "Chảy dịch mũi",
    value: "Chảy dịch mũi",
  },
  {
    label: "Chảy máu cam",
    value: "Chảy máu cam",
  },
  {
    label: "Hắt hơi",
    value: "Hắt hơi",
  },
  {
    label: "Khịt mũi",
    value: "Khịt mũi",
  },
  {
    label: "Mũi ngứa",
    value: "Mũi ngứa",
  },
  {
    label: "Nghẹt mũi",
    value: "Nghẹt mũi",
  },
  {
    label: "Sưng mũi",
    value: "Sưng mũi",
  },
  {
    label: "Sổ mũi",
    value: "Sổ mũi",
  },
  {
    label: "Miệng ngứa",
    value: "Miệng ngứa",
  },
  {
    label: "Miệng phồng rộp",
    value: "Miệng phồng rộp",
  },
  {
    label: "Viêm họng",
    value: "Viêm họng",
  },
  {
    label: "Viêm nướu",
    value: "Viêm nướu",
  },
  {
    label: "Đau môi",
    value: "Đau môi",
  },
  {
    label: "Ho",
    value: "Ho",
  },
  {
    label: "Khó thở",
    value: "Khó thở",
  },
  {
    label: "Thở khò khè",
    value: "Thở khò khè",
  },
  {
    label: "Da khô",
    value: "Da khô",
  },
  {
    label: "Da đỏ",
    value: "Da đỏ",
  },
  {
    label: "Mụn nước",
    value: "Mụn nước",
  },
  {
    label: "Nổi mề đay",
    value: "Nổi mề đay",
  },
  {
    label: "Nứt da",
    value: "Nứt da",
  },
  {
    label: "Phát ban",
    value: "Phát ban",
  },
  {
    label: "Tróc vẩy",
    value: "Tróc vẩy",
  },
  {
    label: "Buồn nôn",
  },
  {
    label: "Nôn mửa",
    value: "Nôn mửa",
  },
  {
    label: "Tiêu chảy",
    value: "Tiêu chảy",
  },
  {
    label: "Táo bón",
    value: "Táo bón",
  },
  {
    label: "Đầy hơi",
    value: "Đầy hơi",
  },
];

export const VACCINE = [
  {
    month: "Sơ sinh",
    note: "Tiêm càng sớm càng tốt sau khi sinh",
    vaccine: [
      {
        name: `Engerix B/Euvax B`,
        note: `Viêm gan B`,
      },
      {
        name: "BCG",
        note: "Bệnh lao",
      },
    ],
  },
  {
    month: "2 tháng tuổi",
    note: "Chọn 1 trong 2 loại vaccine(6 trong 1 hoặc 5 trong 1)",
    vaccine: [
      {
        name: `Infanrix hexa (Bỉ)/Hexaxim (Pháp): 6 trong 1 (Mũi 1)`,
        note: `Bạch hầu, ho gà, uốn ván, bại liệt, Hib, viêm gan B (nếu chưa tiêm)`,
      },
      {
        name: "Pentaxim (Pháp)/Infanrix IPV + Hib (Bỉ): 5 trong 1 (Mũi 1)",
        note: "Bạch hầu, ho gà, uốn ván, bại liệt, Hib (nếu chưa tiêm)",
      },
      {
        name: "Rotarix (Bỉ)/Rotateq (Mỹ)/Rotavin-M1 (Việt Nam) (Liều 1)",
        note: "Tiêu chảy cấp do Rota virus",
      },
      {
        name: "Synflorix (Bỉ)/Prevenar 13 (Bỉ) (Mũi 1)",
        note: "viêm tai giữa, viêm phổi, viêm màng não do phế cầu khuẩn",
      },
    ],
  },
  {
    month: "3 tháng tuổi",
    note: "Chọn 1 trong 2 loại vaccine(6 trong 1 hoặc 5 trong 1)",
    vaccine: [
      {
        name: `Infanrix hexa (Bỉ)/Hexaxim (Pháp): 6 trong 1 (Mũi 2)`,
        note: `Bạch hầu, ho gà, uốn ván, bại liệt, Hib, viêm gan B`,
      },
      {
        name: "Pentaxim (Pháp)/Infanrix IPV + Hib (Bỉ): 5 trong 1 (Mũi 2)",
        note: "Bạch hầu, ho gà, uốn ván, bại liệt, Hib (Tiêm thêm viêm gan B)",
      },
      {
        name: "Rotarix (Bỉ)/Rotateq (Mỹ)/Rotavin-M1 (Việt Nam) (Liều 2)",
        note: "Tiêu chảy cấp do Rota virus",
      },
    ],
  },
  {
    month: "4 tháng tuổi",
    note: "Chọn 1 trong 2 loại vaccine(6 trong 1 hoặc 5 trong 1)",
    vaccine: [
      {
        name: `Infanrix hexa (Bỉ)/Hexaxim (Pháp): 6 trong 1 (Mũi 3)`,
        note: `Bạch hầu, ho gà, uốn ván, bại liệt, Hib, viêm gan B`,
      },
      {
        name: "Pentaxim (Pháp)/Infanrix IPV + Hib (Bỉ): 5 trong 1 (Mũi 3)",
        note: "Bạch hầu, ho gà, uốn ván, bại liệt, Hib (Tiêm thêm viêm gan B)",
      },
      {
        name: "Rotarix (Bỉ)/Rotateq (Mỹ)/Rotavin-M1 (Việt Nam) (Liều 3)",
        note: "Tiêu chảy cấp do Rota virus",
      },
      {
        name: "Synflorix (Bỉ)/Prevenar 13 (Bỉ) (Mũi 2)",
        note: "viêm tai giữa, viêm phổi, viêm màng não do phế cầu khuẩn",
      },
    ],
  },
  {
    month: "6 tháng tuổi",
    note: "",
    vaccine: [
      {
        name: `Vaxigrip Tetra (Pháp) (Mũi 1)`,
        note: `Bệnh cúm`,
      },
      {
        name: "VA-MENGOC-BC (Cu Ba) (Mũi 1)",
        note: "bệnh viêm màng não do não mô cầu B+C",
      },
      {
        name: "Synflorix (Bỉ)/Prevenar 13 (Bỉ) (Mũi 3)",
        note: "viêm tai giữa, viêm phổi, viêm màng não do phế cầu khuẩn",
      },
    ],
  },
  {
    month: "7 tháng tuổi",
    note: "",
    vaccine: [
      {
        name: `Vaxigrip Tetra (Pháp) (Mũi 2)`,
        note: `Bệnh cúm`,
      },
    ],
  },
  {
    month: "9 tháng tuổi",
    note: "",
    vaccine: [
      {
        name: "VA-MENGOC-BC (Cu Ba) (Mũi 2)",
        note: "bệnh viêm màng não do não mô cầu B+C",
      },
      {
        name: "MVVac (Việt Nam)",
        note: "Bệnh sởi",
      },
      {
        name: "Varilrix (Bỉ)",
        note: "Bệnh thủy đậu",
      },
      {
        name: "Imojev (Thái Lan)",
        note: "Viêm não Nhật Bản",
      },
    ],
  },
  {
    month: "12 tháng tuổi",
    note: "",
    vaccine: [
      {
        name: "MMR-II (Mỹ): 3 trong 1",
        note: "Bệnh sởi, quai bị, rubella",
      },
      {
        name: "Varivax/Varicella (Nếu chưa tiêm Varilrix)",
        note: "Bệnh thủy đậu",
      },
      {
        name: "Jevax (Việt Nam) (Tiêm 2 mũi, cách nhau 1 – 2 tuần)",
        note: "Bệnh viêm não Nhật Bản B",
      },
      {
        name: "Avaxim 80U/0.5ml (Mũi đầu)",
        note: "Bệnh viêm gan A",
      },
      {
        name: "Synflorix (Bỉ)/Prevenar 13 (Bỉ) (Mũi 4)",
        note: "viêm tai giữa, viêm phổi, viêm màng não do phế cầu khuẩn",
      },
    ],
  },
  {
    month: "15-24 tháng tuổi",
    note: "Chọn 1 trong 2 loại vaccine(6 trong 1 hoặc 5 trong 1)",
    vaccine: [
      {
        name: `Infanrix hexa (Bỉ)/Hexaxim (Pháp): 6 trong 1 (Mũi 4)`,
        note: `Bạch hầu, ho gà, uốn ván, bại liệt, Hib, viêm gan B`,
      },
      {
        name: "Pentaxim (Pháp)/Infanrix IPV + Hib (Bỉ): 5 trong 1 (Mũi 4)",
        note: "Bạch hầu, ho gà, uốn ván, bại liệt, Hib (Tiêm thêm viêm gan B)",
      },
      {
        name: "Avaxim 80U/0.5ml (Mũi nhắc)",
        note: "Bệnh viêm gan A",
      },
      {
        name: "Vaxigrip Tetra (Pháp) (Mũi 3 – sau mũi thứ hai 1 năm)",
        note: "Bệnh cúm",
      },
    ],
  },
  {
    month: "Đủ 24 tháng tuổi",
    note: "",
    vaccine: [
      {
        name: `Menactra (Mỹ)`,
        note: `Bệnh viêm màng não do não mô cầu A,C,Y,W-135`,
      },
      {
        name: "Jevax (Việt Nam) (Mũi 3)",
        note: "bệnh viêm não Nhật Bản B",
      },
      {
        name: "Typhim VI/Typhoid VI",
        note: "Bệnh thương hàn",
      },
      {
        name: "Tả mORCVAX (Việt Nam) ",
        note: "Bệnh Tả",
      },
    ],
  },
];

export const LIST_VACCINE_CHILD = [
  { label: "Engerix B/Euvax B", value: "Engerix B/Euvax B" },
  { label: "BCG", value: "BCG" },
  {
    label: "Infanrix hexa (Bỉ)/Hexaxim (Pháp): 6 trong 1 (Mũi 1)",
    value: "Infanrix hexa (Bỉ)/Hexaxim (Pháp): 6 trong 1 (Mũi 1)",
  },
  {
    label: "Pentaxim (Pháp)/Infanrix IPV + Hib (Bỉ): 5 trong 1 (Mũi 1)",
    value: "Pentaxim (Pháp)/Infanrix IPV + Hib (Bỉ): 5 trong 1 (Mũi 1)",
  },
  {
    label: "Rotarix (Bỉ)/Rotateq (Mỹ)/Rotavin-M1 (Việt Nam) (Liều 1)",
    value: "Rotarix (Bỉ)/Rotateq (Mỹ)/Rotavin-M1 (Việt Nam) (Liều 1)",
  },
  {
    label: "Synflorix (Bỉ)/Prevenar 13 (Bỉ) (Mũi 1)",
    value: "Synflorix (Bỉ)/Prevenar 13 (Bỉ) (Mũi 1)",
  },
  {
    label: "Infanrix hexa (Bỉ)/Hexaxim (Pháp): 6 trong 1 (Mũi 2)",
    value: "Infanrix hexa (Bỉ)/Hexaxim (Pháp): 6 trong 1 (Mũi 2)",
  },
  {
    label: "Pentaxim (Pháp)/Infanrix IPV + Hib (Bỉ): 5 trong 1 (Mũi 2)",
    value: "Pentaxim (Pháp)/Infanrix IPV + Hib (Bỉ): 5 trong 1 (Mũi 2)",
  },
  {
    label: "Rotarix (Bỉ)/Rotateq (Mỹ)/Rotavin-M1 (Việt Nam) (Liều 2)",
    value: "Rotarix (Bỉ)/Rotateq (Mỹ)/Rotavin-M1 (Việt Nam) (Liều 2)",
  },
  {
    label: "Infanrix hexa (Bỉ)/Hexaxim (Pháp): 6 trong 1 (Mũi 3)",
    value: "Infanrix hexa (Bỉ)/Hexaxim (Pháp): 6 trong 1 (Mũi 3)",
  },
  {
    label: "Pentaxim (Pháp)/Infanrix IPV + Hib (Bỉ): 5 trong 1 (Mũi 3)",
    value: "Pentaxim (Pháp)/Infanrix IPV + Hib (Bỉ): 5 trong 1 (Mũi 3)",
  },
  {
    label: "Rotarix (Bỉ)/Rotateq (Mỹ)/Rotavin-M1 (Việt Nam) (Liều 3)",
    value: "Rotarix (Bỉ)/Rotateq (Mỹ)/Rotavin-M1 (Việt Nam) (Liều 3)",
  },
  {
    label: "Synflorix (Bỉ)/Prevenar 13 (Bỉ) (Mũi 2)",
    value: "Synflorix (Bỉ)/Prevenar 13 (Bỉ) (Mũi 2)",
  },
  {
    label: "Vaxigrip Tetra (Pháp) (Mũi 1)",
    value: "Vaxigrip Tetra (Pháp) (Mũi 1)",
  },
  {
    label: "VA-MENGOC-BC (Cu Ba) (Mũi 1)",
    value: "VA-MENGOC-BC (Cu Ba) (Mũi 1)",
  },
  {
    label: "Synflorix (Bỉ)/Prevenar 13 (Bỉ) (Mũi 3)",
    value: "Synflorix (Bỉ)/Prevenar 13 (Bỉ) (Mũi 3)",
  },
  {
    label: "Vaxigrip Tetra (Pháp) (Mũi 2)",
    value: "Vaxigrip Tetra (Pháp) (Mũi 2)",
  },
  {
    label: "VA-MENGOC-BC (Cu Ba) (Mũi 2)",
    value: "VA-MENGOC-BC (Cu Ba) (Mũi 2)",
  },
  { label: "MVVac (Việt Nam)", value: "MVVac (Việt Nam)" },
  { label: "Varilrix (Bỉ)", value: "Varilrix (Bỉ)" },
  { label: "Imojev (Thái Lan)", value: "Imojev (Thái Lan)" },
  { label: "MMR-II (Mỹ): 3 trong 1", value: "MMR-II (Mỹ): 3 trong 1" },
  {
    label: "Varivax/Varicella (Nếu chưa tiêm Varilrix)",
    value: "Varivax/Varicella (Nếu chưa tiêm Varilrix)",
  },
  {
    label: "Jevax (Việt Nam) (Tiêm 2 mũi, cách nhau 1 – 2 tuần)",
    value: "Jevax (Việt Nam) (Tiêm 2 mũi, cách nhau 1 – 2 tuần)",
  },
  { label: "Avaxim 80U/0.5ml (Mũi đầu)", value: "Avaxim 80U/0.5ml (Mũi đầu)" },
  {
    label: "Synflorix (Bỉ)/Prevenar 13 (Bỉ) (Mũi 4)",
    value: "Synflorix (Bỉ)/Prevenar 13 (Bỉ) (Mũi 4)",
  },
  {
    label: "Infanrix hexa (Bỉ)/Hexaxim (Pháp): 6 trong 1 (Mũi 4)",
    value: "Infanrix hexa (Bỉ)/Hexaxim (Pháp): 6 trong 1 (Mũi 4)",
  },
  {
    label: "Pentaxim (Pháp)/Infanrix IPV + Hib (Bỉ): 5 trong 1 (Mũi 4)",
    value: "Pentaxim (Pháp)/Infanrix IPV + Hib (Bỉ): 5 trong 1 (Mũi 4)",
  },
  {
    label: "Avaxim 80U/0.5ml (Mũi nhắc)",
    value: "Avaxim 80U/0.5ml (Mũi nhắc)",
  },
  {
    label: "Vaxigrip Tetra (Pháp) (Mũi 3 – sau mũi thứ hai 1 năm)",
    value: "Vaxigrip Tetra (Pháp) (Mũi 3 – sau mũi thứ hai 1 năm)",
  },
  { label: "Menactra (Mỹ)", value: "Menactra (Mỹ)" },
  { label: "Jevax (Việt Nam) (Mũi 3)", value: "Jevax (Việt Nam) (Mũi 3)" },
  { label: "Typhim VI/Typhoid VI", value: "Typhim VI/Typhoid VI" },
  { label: "Tả mORCVAX (Việt Nam)", value: "Tả mORCVAX (Việt Nam)" },
];

export const LIST__HANGOUT = [
  {
    label: "Massage cho bé",
    value: "Massage cho bé",
  },
  {
    label: "Nói chuyện với bé",
    value: "Nói chuyện với bé",
  },
  {
    label: "Đi về phía ai đó",
    value: "Đi về phía ai đó",
  },
  {
    label: "Đọc sách",
    value: "Đọc sách",
  },
  {
    label: "Bò về phía đồ chơi",
    value: "Bò về phía đồ chơi",
  },
  {
    label: "Chơi khi nằm nghiêng",
    value: "Chơi khi nằm nghiêng",
  },
  {
    label: "Chơi với nước",
    value: "Chơi với nước",
  },
  {
    label: "Kéo để ngồi",
    value: "Kéo để ngồi",
  },
  {
    label: "Nhảy theo điệu nhạc",
    value: "Nhảy theo điệu nhạc",
  },
  {
    label: "Nắm giữ đồ chơi",
    value: "Nắm giữ đồ chơi",
  },
  {
    label: "Đi trong lúc nắm tay hỗ trợ",
    value: "Đi trong lúc nắm tay hỗ trợ",
  },
  {
    label: "Đá chân khi nằm",
    value: "Đá chân khi nằm",
  },
  {
    label: "Ú òa",
    value: "Ú òa",
  },
  {
    label: "Đi tự nhiên",
    value: "Đi tự nhiên",
  },
  {
    label: "Bài hát ngón tay",
    value: "Bài hát ngón tay",
  },
  {
    label: "Bài hát đếm số",
    value: "Bài hát đếm số",
  },
  {
    label: "Hát cho bé",
    value: "Hát cho bé",
  },
  {
    label: "Nói chuyện với bé",
    value: "Nói chuyện với bé",
  },
  {
    label: "Thơ vần cho bé",
    value: "Thơ vần cho bé",
  },
];
