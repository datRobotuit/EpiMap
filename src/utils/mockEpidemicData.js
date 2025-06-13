/**
 * Dữ liệu bệnh dịch theo tỉnh thành
 */

import axios from 'axios';

const fetchLatestReport = async (provinceName, diseaseType) => {
    try {
        const province = encodeURIComponent(provinceName);
        const type = encodeURIComponent(diseaseType);

    const response = await axios.get(`http://localhost:5000/api/report/latest/${province}/${type}`);
    console.log('Latest Report:', response.data);
  } catch (error) {
      console.error('Error fetching report:', error.response?.data || error.message);
    }
};

// Danh sách các loại bệnh
const DISEASE_TYPES = [
    { id: "covid19", name: "Covid-19", color: [220, 53, 69, 0.7] },
    { id: "dengue", name: "Sốt xuất huyết", color: [255, 193, 7, 0.7] },
    { id: "influenza", name: "Cúm mùa", color: [13, 110, 253, 0.7] },
    { id: "malaria", name: "Sốt rét", color: [25, 135, 84, 0.7] },
    { id: "hepatitis", name: "Viêm gan", color: [111, 66, 193, 0.7] }
];

// Sinh ngẫu nhiên số lượng ca bệnh cho từng tỉnh
const generateMockData = () => {
    // Test API
    fetchLatestReport('An Giang', 'covid19');

    const allProvinces = [
        "ha_giang", "cao_bang", "lao_cai", "son_la", "lai_chau", "bac_kan", "lang_son",
        "tuyen_quang", "yen_bai", "thai_nguyen", "dien_bien", "phu_tho", "vinh_phuc",
        "bac_giang", "bac_ninh", "ha_noi", "quang_ninh", "hai_duong", "hai_phong",
        "hoa_binh", "hung_yen", "ha_nam", "thai_binh", "nam_dinh", "ninh_binh",
        "thanh_hoa", "nghe_an", "ha_tinh", "quang_binh", "quang_tri", "thua_thien_hue",
        "da_nang", "quang_nam", "quang_ngai", "kon_tum", "gia_lai", "binh_dinh",
        "phu_yen", "dak_lak", "khanh_hoa", "dak_nong", "lam_dong", "ninh_thuan",
        "binh_phuoc", "tay_ninh", "binh_duong", "dong_nai", "binh_thuan", "ho_chi_minh",
        "ba_ria_vung_tau", "an_giang", "bac_lieu", "ben_tre", "ca_mau", "can_tho",
        "dong_thap", "hau_giang", "kien_giang", "long_an", "soc_trang", "tien_giang",
        "tra_vinh", "vinh_long"
    ];

    // const allProvinces = [
    //   "An Giang",
    //   "Bà Rịa - Vũng Tàu",
    //   "Bình Dương",
    //   "Bình Phước",
    //   "Bình Thuận",
    //   "Bình Định",
    //   "Bạc Liêu",
    //   "Bắc Giang",
    //   "Bắc Kạn",
    //   "Bắc Ninh",
    //   "Bến Tre",
    //   "Cao Bằng",
    //   "Cà Mau",
    //   "Cần Thơ",
    //   "Gia Lai",
    //   "Hoà Bình",
    //   "Hà Giang",
    //   "Hà Nam",
    //   "Hà Nội",
    //   "Hà Tĩnh",
    //   "Hòa Bình",
    //   "Hưng Yên",
    //   "Hải Dương",
    //   "Hải Phòng",
    //   "Hậu Giang",
    //   "Hồ Chí Minh",
    //   "Khánh Hòa",
    //   "Kiên Giang",
    //   "Kon Tum",
    //   "Lai Châu",
    //   "Long An",
    //   "Lào Cai",
    //   "Lâm Đồng",
    //   "Lạng Sơn",
    //   "Nam Định",
    //   "Nghệ An",
    //   "Ninh Bình",
    //   "Ninh Thuận",
    //   "Phú Thọ",
    //   "Phú Yên",
    //   "Quảng Bình",
    //   "Quảng Nam",
    //   "Quảng Ngãi",
    //   "Quảng Ninh",
    //   "Quảng Trị",
    //   "Sóc Trăng",
    //   "Sơn La",
    //   "Thanh Hóa",
    //   "Thái Bình",
    //   "Thái Nguyên",
    //   "Thừa Thiên Huế",
    //   "Tiền Giang",
    //   "Trà Vinh",
    //   "Tuyên Quang",
    //   "Tây Ninh",
    //   "Vĩnh Long",
    //   "Vĩnh Phúc",
    //   "Yên Bái",
    //   "Điện Biên",
    //   "Đà Nẵng",
    //   "Đắk Lắk",
    //   "Đắk Nông",
    //   "Đồng Nai",
    //   "Đồng Tháp",
    // ];

    // Dữ liệu mô phỏng ca bệnh
    const mockData = {};

    // Các biến thống kê chung
    let totalCases = 0;
    let totalActive = 0;
    let totalRecovered = 0;
    let totalDeaths = 0;
    let maxCases = 0;
    let minCases = Infinity;

    // Thêm một số tỉnh có nhiều ca bệnh hơn
    const hotspots = ["ho_chi_minh", "ha_noi", "binh_duong", "dong_nai", "da_nang", "khanh_hoa"];

    // Tạo dữ liệu cho từng tỉnh
    allProvinces.forEach(province => {
        // Khởi tạo dữ liệu cho từng loại bệnh
        const provinceData = {};

        // Thống kê chung cho tỉnh
        let provinceTotalCases = 0;
        let provinceTotalActive = 0;
        let provinceTotalRecovered = 0;
        let provinceTotalDeaths = 0;

        // Tạo dữ liệu cho từng loại bệnh
        DISEASE_TYPES.forEach(disease => {
            // Sinh ngẫu nhiên số ca nhiễm (cao hơn ở các hotspot)
            const isHotspot = hotspots.includes(province);

            // Điều chỉnh mức độ phổ biến của từng loại bệnh
            let popularityFactor = 1.0;
            if (disease.id === "covid19") popularityFactor = 5.0;
            else if (disease.id === "influenza") popularityFactor = 3.0;
            else if (disease.id === "dengue") popularityFactor = 2.0;

            const baseCases = isHotspot
                ? Math.floor(Math.random() * 2000 * popularityFactor) + 1000  // 1000-3000 ca (hoặc nhiều hơn nếu phổ biến)
                : Math.floor(Math.random() * 500 * popularityFactor) + 50;    // 50-550 ca (hoặc nhiều hơn nếu phổ biến)

            // Tính toán các số liệu khác
            const active = Math.floor(baseCases * (Math.random() * 0.3 + 0.1)); // 10-40% đang điều trị
            const deaths = Math.floor(baseCases * (Math.random() * 0.02 + 0.005)); // 0.5-2.5% tử vong
            const recovered = baseCases - active - deaths; // Còn lại là đã hồi phục

            // Tạo đối tượng dữ liệu cho loại bệnh
            provinceData[disease.id] = {
                totalCases: baseCases,
                activeCases: active,
                recovered: recovered,
                deaths: deaths,
                newCases: Math.floor(Math.random() * (active / 2)), // Ca mới trong ngày
                vaccinationRate: disease.id === "covid19" || disease.id === "influenza" ? Math.random() * 40 + 60 : 0, // Tỷ lệ tiêm chủng chỉ có cho covid và cúm
                incidenceRate: (baseCases / 100000 * 100).toFixed(2), // Tỷ lệ mắc/100,000 dân
            };

            // Cập nhật thống kê tỉnh
            provinceTotalCases += baseCases;
            provinceTotalActive += active;
            provinceTotalRecovered += recovered;
            provinceTotalDeaths += deaths;
        });

        // Thêm thống kê tổng hợp cho tỉnh
        provinceData.totalCases = provinceTotalCases;
        provinceData.activeCases = provinceTotalActive;
        provinceData.recovered = provinceTotalRecovered;
        provinceData.deaths = provinceTotalDeaths;
        provinceData.newCases = Math.floor(Math.random() * (provinceTotalActive / 2));
        provinceData.vaccinationRate = Math.random() * 40 + 60; // Tỷ lệ tiêm chủng chung 60-100%
        provinceData.incidenceRate = (provinceTotalCases / 100000 * 100).toFixed(2);

        // Thêm dữ liệu của tỉnh vào mockData
        mockData[province] = provinceData;

        // Cập nhật thống kê chung
        totalCases += provinceTotalCases;
        totalActive += provinceTotalActive;
        totalRecovered += provinceTotalRecovered;
        totalDeaths += provinceTotalDeaths;

        if (provinceTotalCases > maxCases) maxCases = provinceTotalCases;
        if (provinceTotalCases < minCases) minCases = provinceTotalCases;
    });

    // Thêm thông tin thống kê chung
    mockData.statistics = {
        totalCases,
        totalActive,
        totalRecovered,
        totalDeaths,
        maxCases,
        minCases
    };

    // Thêm thông tin về các loại bệnh
    mockData.diseaseTypes = DISEASE_TYPES;

    return mockData;
};

const epidemicData = generateMockData();

export default epidemicData;