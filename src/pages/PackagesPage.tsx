import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "@/components/Navbar";
import { Star, Clock, MapPin, ArrowRight, Filter, Plane, Globe } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";

const packages = [
  {
    id: 1,
    name: "ฮ่องกง เปิดท้องพระคลังเจ้าแม่กวนอิมฮ่องฮำ เส้นทางเศรษฐี มูเสริมทรัพย์รับโชค 4 วัน 3 คืน",
    image: "https://cdn.sanity.io/images/lfbcy0yz/production/6dd628ba8e49dfc09c9ff160450b0a75a017c6c4-1040x1040.jpg",
    days: 4,
    nights: 3,
    price: 22900,
    airline: "Thai Airways [TG]",
    highlights: ["เส้นทางเศรษฐี", "มูเสริมทรัพย์", "ฟรีเดย์"],
    country: "ฮ่องกง",
    destination: "ฮ่องกง",
    link: "https://www.regentholiday.com/tours/%E0%B8%AE%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%81%E0%B8%87%20%E0%B9%80%E0%B8%9B%E0%B8%B4%E0%B8%94%E0%B8%97%E0%B9%89%E0%B8%AD%E0%B8%87%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%84%E0%B8%A5%E0%B8%B1%E0%B8%87%E0%B9%80%E0%B8%88%E0%B9%89%E0%B8%B2%E0%B9%81%E0%B8%A1%E0%B9%88%E0%B8%81%E0%B8%A7%E0%B8%99%E0%B8%AD%E0%B8%B4%E0%B8%A1%E0%B8%AE%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%AE%E0%B8%B3%20%E0%B9%80%E0%B8%AA%E0%B9%89%E0%B8%99%E0%B8%97%E0%B8%B2%E0%B8%87%E0%B9%80%E0%B8%A8%E0%B8%A3%E0%B8%A9%E0%B8%90%E0%B8%B5%20%E0%B8%A1%E0%B8%B9%E0%B9%80%E0%B8%AA%E0%B8%A3%E0%B8%B4%E0%B8%A1%E0%B8%97%E0%B8%A3%E0%B8%B1%E0%B8%9E%E0%B8%A2%E0%B9%8C%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B9%82%E0%B8%8A%E0%B8%84%204%20%E0%B8%A7%E0%B8%B1%E0%B8%99%203%20%E0%B8%84%E0%B8%B7%E0%B8%99%20%E0%B9%82%E0%B8%94%E0%B8%A2%E0%B8%AA%E0%B8%B2%E0%B8%A2%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%9A%E0%B8%B4%E0%B8%99%20Thai%20Airways%20(TG)%20(%E0%B8%9F%E0%B8%A3%E0%B8%B5%E0%B9%80%E0%B8%94%E0%B8%A2%E0%B9%8C)",
    featured: true,
  },
  {
    id: 2,
    name: "สเปนเป็นเหตุ โปรตุเกสพิเศษทาร์ตไข่ โปรตุเกส สเปน 10 วัน 7 คืน",
    image: "https://cdn.sanity.io/images/lfbcy0yz/production/1d2004b9535967c47cbd3923b00480f85e097cbf-1040x1040.jpg",
    days: 10,
    nights: 7,
    price: 95900,
    airline: "Emirates [EK]",
    highlights: ["บาร์เซโลนา", "มาดริด", "ซาลามันกา"],
    country: "ยุโรป",
    destination: "บาร์เซโลนา, มาดริด, ซาลามันกา",
    link: "https://www.regentholiday.com/tours/%E0%B8%AA%E0%B9%80%E0%B8%9B%E0%B8%99%E0%B9%80%E0%B8%9B%E0%B9%87%E0%B8%99%E0%B9%80%E0%B8%AB%E0%B8%95%E0%B8%B8%20%E0%B9%82%E0%B8%9B%E0%B8%A3%E0%B8%95%E0%B8%B8%E0%B9%80%E0%B8%81%E0%B8%AA%E0%B8%9E%E0%B8%B4%E0%B9%80%E0%B8%A8%E0%B8%A9%E0%B8%97%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%95%E0%B9%84%E0%B8%82%E0%B9%88%20%E0%B9%82%E0%B8%9B%E0%B8%A3%E0%B8%95%E0%B8%B8%E0%B9%80%E0%B8%81%E0%B8%AA%20%E0%B8%AA%E0%B9%80%E0%B8%9B%E0%B8%99%2010%E0%B8%A7%E0%B8%B1%E0%B8%99%207%E0%B8%84%E0%B8%B7%E0%B8%99%20%E0%B9%82%E0%B8%94%E0%B8%A2%E0%B8%AA%E0%B8%B2%E0%B8%A2%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%9A%E0%B8%B4%E0%B8%99%20Emirates%20(EK)",
    featured: true,
  },
  {
    id: 3,
    name: "โมร็อคโค ผืนทรายจรดฟ้า ซาฮาร่าที่รัก 10 วัน 7 คืน",
    image: "https://cdn.sanity.io/images/lfbcy0yz/production/988af1ee9b80bdbd20502b523dd9411824e6167d-1080x1080.jpg",
    days: 10,
    nights: 7,
    price: 75900,
    airline: "ETIHAD AIRWAYS [EY]",
    highlights: ["คาซาบลังกา", "ราบัต", "ซาฮาร่า"],
    country: "แอฟริกา",
    destination: "คาซาบลังกา, ราบัต",
    link: "https://www.regentholiday.com/tours/10-7-etihad-airways-ey",
    featured: true,
  },
  {
    id: 4,
    name: "ล่าแสงเขียว เที่ยวแดนน้ำแข็ง สวีเดน - ไอซ์แลนด์ – เดนมาร์ก 10 วัน 7 คืน",
    image: "https://cdn.sanity.io/images/lfbcy0yz/production/f6f056381d44553c09832a33db2717ce42c42ee1-1080x1080.jpg",
    days: 10,
    nights: 7,
    price: 165900,
    airline: "Emirates [EK]",
    highlights: ["แสงเหนือ", "ไอซ์แลนด์", "สวีเดน"],
    country: "ยุโรป",
    destination: "โคเปนเฮเกน, เรกยาวิก, สต็อกโฮล์ม",
    link: "https://www.regentholiday.com/tours/10-7-emirates-ek",
    featured: true,
  },
  {
    id: 5,
    name: "เกาะฟูก๊วก เวียดนาม เที่ยวพักผ่อนสบายๆ 3 วัน 2 คืน",
    image: "https://cdn.sanity.io/images/lfbcy0yz/production/9f19b1528446ef55fa671ec951bc396142337030-1080x1080.png",
    days: 3,
    nights: 2,
    price: 14580,
    airline: "Thai VietJet Air [VZ]",
    highlights: ["Sunset Town", "Kiss Bridge", "VinWonders"],
    country: "เวียดนาม",
    destination: "เกาะฟูก๊วก",
    link: "https://www.regentholiday.com/tours/Phu%20Quoc-Vietnam-relax-3d-2n-free%20easy",
  },
  {
    id: 6,
    name: "TAKAYAMA HAKUBA TOKYO SKI FUJI WINTER 7D 4N",
    image: "https://cdn.sanity.io/images/lfbcy0yz/production/3df878d44d56e30e14658171fbc578229cf8b367-1040x1040.jpg",
    days: 7,
    nights: 4,
    price: 53900,
    airline: "การบินไทย [TG]",
    highlights: ["ฮาคุบะ", "ลานสกี", "หมู่บ้านชิราคาวาโกะ"],
    country: "ญี่ปุ่น",
    destination: "นาโกย่า, โตเกียว, ทากายาม่า",
    link: "https://www.regentholiday.com/tours/takayama-hakuba-tokyo-ski-fuji-winter-7d-4n-tg",
  },
  {
    id: 7,
    name: "TAKAYAMA HAKUBA TSUGAIKE SNOW WALL 6D 4N",
    image: "https://cdn.sanity.io/images/lfbcy0yz/production/8b3df0a9d626e3154713d0a6b9b56eeb9056a40c-1040x1040.jpg",
    days: 6,
    nights: 4,
    price: 54900,
    airline: "การบินไทย [TG]",
    highlights: ["TSUGAIKE SNOW WALL", "ชิราคาวาโกะ", "ฮาคุบะ"],
    country: "ญี่ปุ่น",
    destination: "มัตสึโมโตะ, นาโกย่า, โอซากะ",
    link: "https://www.regentholiday.com/tours/takayama-hakuba-tsugaike-snow-wall-6d-4n-tg",
  },
  {
    id: 8,
    name: "เฉิงตู อุทยานสี่ดรุณี ภูเขาหิมะวาวู่ ล่องเรือชมหลวงพ่อโตเล่อซาน 5 วัน 4 คืน *ไม่ลงร้านช้อป*",
    image: "https://cdn.sanity.io/images/lfbcy0yz/production/077b02a79079b2762712e4691f29787218fe1737-1040x1040.jpg",
    days: 5,
    nights: 4,
    price: 17900,
    airline: "Thai Lion Air [SL]",
    highlights: ["อุทยานสี่ดรุณี", "ภูเขาหิมะวาวู่", "หลวงพ่อโตเล่อซาน"],
    country: "จีน",
    destination: "เฉิงตู",
    link: "https://www.regentholiday.com/tours/5-4-thai-lion-air-sl",
  },
  {
    id: 9,
    name: "KOREA ไปเกาหลีแบบคนธรรมดา กลับมาเหมือนนางงาม 5 วัน 3 คืน",
    image: "https://cdn.sanity.io/images/lfbcy0yz/production/8d4d4701a23a47cedddeeb2e548fe70ec59a044e-1080x1080.jpg",
    days: 5,
    nights: 3,
    price: 25900,
    airline: "Asiana Airlines [OZ]",
    highlights: ["เกาะนามิ", "ป้อมฮวาซอง", "ฮงแด"],
    country: "เกาหลี",
    destination: "โซล",
    link: "https://www.regentholiday.com/tours/korea-5-3-oz",
  },
  {
    id: 10,
    name: "TOKYO SKI WINTER ILLUMINATION 5D 3N",
    image: "https://cdn.sanity.io/images/lfbcy0yz/production/34176431c34813f969a370f7295a7b1abff122f1-1040x1040.jpg",
    days: 5,
    nights: 3,
    price: 29900,
    airline: "Thai VietJet Air [VZ]",
    highlights: ["งานประดับไฟ", "ลานสกี", "คาวาโกเอะ"],
    country: "ญี่ปุ่น",
    destination: "โตเกียว",
    link: "https://www.regentholiday.com/tours/tokyo-ski-winter-illumination-5d-3n-vz",
  },
  {
    id: 11,
    name: "TOHOKU SENDAI AOMORI SNOW MONSTER 6D 4N",
    image: "https://cdn.sanity.io/images/lfbcy0yz/production/3dcc21a3f6fd7f799420f4abbc57835749ed0689-1040x1040.jpg",
    days: 6,
    nights: 4,
    price: 43900,
    airline: "Thai AirAsia X [XJ]",
    highlights: ["SNOW MONSTER", "ทะเลสาบโทวาดะ", "ปราสาทฮิโรซากิ"],
    country: "ญี่ปุ่น",
    destination: "อะกิตะ, อะโอะโมะริ, เซนได",
    link: "https://www.regentholiday.com/tours/tohoku-sendai-aomori-snow-monster-6d-4n-xj",
  },
  {
    id: 12,
    name: "OSAKA TAKAYAMA SHINHOTAKA WINTER 6D 4N",
    image: "https://cdn.sanity.io/images/lfbcy0yz/production/d648155843d4b7750a9438a1c51fedf51fe29ed4-1040x1040.jpg",
    days: 6,
    nights: 4,
    price: 50900,
    airline: "การบินไทย [TG]",
    highlights: ["กระเช้าชินโฮตากะ", "ชิราคาวาโกะ", "ศาลเจ้าฟูชิมิอินาริ"],
    country: "ญี่ปุ่น",
    destination: "โอซากะ, ทากายาม่า, เกียวโต",
    link: "https://www.regentholiday.com/tours/osaka-takayama-shinhotaka-winter-6d-4n-tg",
  },
  {
    id: 13,
    name: "ซัวเถา บ้านดินถู่โหลวหย่งติ้ง เหมยโจว แต้จิ๋ว 5 วัน 4 คืน",
    image: "https://cdn.sanity.io/images/lfbcy0yz/production/67b5764cc0d6dbb457dbdd6ac077c46a901b66a6-1040x1040.jpg",
    days: 5,
    nights: 4,
    price: 21900,
    airline: "China Southern [CZ]",
    highlights: ["บ้านดินถู่โหลว", "หลวงพ่อโตเล่อซาน", "อาหารแต้จิ๋ว 18 อย่าง"],
    country: "จีน",
    destination: "ซัวเถา",
    link: "https://www.regentholiday.com/tours/5-4-china-southern-cz",
  },
  {
    id: 14,
    name: "Good Vibes อู๋ซี ซูโจว เซี่ยงไฮ้ 5 วัน 4 คืน ตะลอนดิสนีย์แลนด์เซี่ยงไฮ้ เต็มวัน!!",
    image: "https://cdn.sanity.io/images/lfbcy0yz/production/e0d5cf3506a8138e14b2cb1ccf27d170accb05af-1040x1040.jpg",
    days: 5,
    nights: 4,
    price: 25900,
    airline: "Shanghai Airlines [FM]",
    highlights: ["ดิสนีย์แลนด์เซี่ยงไฮ้", "ซูโจว", "อู๋ซี"],
    country: "จีน",
    destination: "เซี่ยงไฮ้, ซูโจว, อู๋ซี",
    link: "https://www.regentholiday.com/tours/good-vibes-5-4-shanghai-airlines-fm",
  },
  {
    id: 15,
    name: "ตุรเคีย 8 วัน 6 คืน ปราสาทปุยฝ้าย กับ ม้าไม้แห่งทรอย พักโรงแรมสไตล์ถ้ำ 1 คืน",
    image: "https://cdn.sanity.io/images/lfbcy0yz/production/76f156c83a4eb1246cefdc9e6df4454433c0a566-1040x1040.jpg",
    days: 8,
    nights: 6,
    price: 46900,
    airline: "Turkish Airlines [TK]",
    highlights: ["ปามุคคาเล่", "คัปปาโดเกีย", "อิสตันบูล"],
    country: "ตุรกี",
    destination: "อิสตันบูล, คัปปาโดเกีย",
    link: "https://www.regentholiday.com/tours/8-6-1-1-turkish-tk",
  },
  {
    id: 16,
    name: "SCANDINAVIA สแกนดิเนเวีย เรือสำราญบานฤทัย สวีเดน - นอร์เวย์ - เดนมาร์ก 8 วัน 5 คืน",
    image: "https://cdn.sanity.io/images/lfbcy0yz/production/3c609610fdcc51b473d1631d7ea62b8264736468-1040x1040.jpg",
    days: 8,
    nights: 5,
    price: 85900,
    airline: "Emirates [EK]",
    highlights: ["ซองฟยอร์ด", "รถไฟฟลัมส์บาน่า", "เรือสำราญ DFDS"],
    country: "ยุโรป",
    destination: "สต็อกโฮล์ม, ออสโล, โคเปนเฮเกน",
    link: "https://www.regentholiday.com/tours/scandinavia-8-5-emirates-ek",
  },
  {
    id: 17,
    name: "อเมริกาตะวันตก ซาน ฟรานซิสโก - ลาส เวกัส - ลอส แองเจลิส 11 วัน 8 คืน",
    image: "https://cdn.sanity.io/images/lfbcy0yz/production/327db5c54bdd9b6fa9daf5662dca3e10ca2fbc38-1040x1040.jpg",
    days: 11,
    nights: 8,
    price: 155500,
    airline: "China Airlines [CI]",
    highlights: ["แกรนด์แคนยอน", "ดิสนีย์แลนด์", "โยเซมิตี"],
    country: "อเมริกา",
    destination: "ซาน ฟรานซิสโก, ลาส เวกัส, ลอส แองเจลิส",
    link: "https://www.regentholiday.com/tours/power-up-11-8-china-airlines-ci",
  },
  {
    id: 18,
    name: "กรุงมะนิลา ฟิลิปปินส์ เที่ยวชิลๆ 3 วัน 2 คืน",
    image: "https://cdn.sanity.io/images/lfbcy0yz/production/081130cc4cfa3ef7ae00c488b6b87d30fca41e14-1080x1080.png",
    days: 3,
    nights: 2,
    price: 18450,
    airline: "Philippine Airlines [PR]",
    highlights: ["Intramuros", "Rizal Park", "SM Mall of Asia"],
    country: "ฟิลิปปินส์",
    destination: "มะนิลา",
    link: "https://www.regentholiday.com/tours/Manila-Philippines-Chill-3d-2n",
  },
  {
    id: 19,
    name: "HOKKAIDO SNOW SOUNKYO ICEBREAKER 7D 5N",
    image: "https://cdn.sanity.io/images/lfbcy0yz/production/42ac49d1ffe11c149a8cb22e255f192f7bfaab13-1040x1040.jpg",
    days: 7,
    nights: 5,
    price: 61900,
    airline: "การบินไทย [TG]",
    highlights: ["ล่องเรือตัดน้ำแข็ง", "Sounkyo Ice Festival", "สวนสัตว์อาซาฮิยามะ"],
    country: "ญี่ปุ่น",
    destination: "ซัปโปโร, อาซาฮิคาวะ",
    link: "https://www.regentholiday.com/tours/hokkaido-snow-sounkyo-icebreaker-7d-5n-tg",
  },
  {
    id: 20,
    name: "A Magic Time in เซี่ยงไฮ้ ปักกิ่ง 6 วัน 4 คืน นั่งรถไฟความเร็วสูง",
    image: "https://cdn.sanity.io/images/lfbcy0yz/production/deef9bd9c1ba7c64994b1871ab4f2b86a1084c9f-1040x1040.jpg",
    days: 6,
    nights: 4,
    price: 35900,
    airline: "Thai Airways [TG]",
    highlights: ["พระราชวังต้องห้าม", "กำแพงเมืองจีน", "เดอะบันด์"],
    country: "จีน",
    destination: "เซี่ยงไฮ้, ปักกิ่ง",
    link: "https://www.regentholiday.com/tours/a-magic-time-in-6-4-thai-airways-tg",
  },
  {
    id: 21,
    name: "TOKYO FUJI SKI YOKOHAMA WINTER LIGHT UP 6D 4N",
    image: "https://cdn.sanity.io/images/lfbcy0yz/production/af59ea14c4dac2b197932dd8ab1005369bbcce1d-1040x1040.jpg",
    days: 6,
    nights: 4,
    price: 49900,
    airline: "การบินไทย [TG]",
    highlights: ["ซากามิโกะ อิลลูมิเนชั่น", "ลานสกี", "YOKOHAMA ILLUMINATION"],
    country: "ญี่ปุ่น",
    destination: "โตเกียว, ไซตามะ",
    link: "https://www.regentholiday.com/tours/tokyo-fuji-ski-yokohama-winter-light-up-6d-4n-tg",
  },
  {
    id: 22,
    name: "บินตรงซีอาน ลั่วหยาง ย้อนรอยสองราชธานี กองทัพทหารดินเผาจิ๋นซี 7 วัน 5 คืน",
    image: "https://cdn.sanity.io/images/lfbcy0yz/production/aa4fb7270a20c37976cd5c0e4c516638f70c8ab1-1040x1040.jpg",
    days: 7,
    nights: 5,
    price: 25900,
    airline: "Thai Lion Air [SL]",
    highlights: ["กองทัพทหารดินเผา", "ผาแกะสลักหลงเหมิน", "วัดเส้าหลิน"],
    country: "จีน",
    destination: "ซีอาน, ลั่วหยาง",
    link: "https://www.regentholiday.com/tours/7-5-sl",
  },
  {
    id: 23,
    name: "Let's go skiing Beijing 5 วัน 3 คืน พิชิตกำแพงเมืองจีน",
    image: "https://cdn.sanity.io/images/lfbcy0yz/production/9ec820929c8ee099c79e9ef7cbbd335d07642f2c-1040x1040.jpg",
    days: 5,
    nights: 3,
    price: 25900,
    airline: "Air China [CA]",
    highlights: ["กำแพงเมืองจีน", "พระราชวังต้องห้าม", "เล่นสกี"],
    country: "จีน",
    destination: "ปักกิ่ง",
    link: "https://www.regentholiday.com/tours/lets-go-skiing-beijing-5-3-air-china-ca",
  },
];

const countries = ["ทั้งหมด", "ญี่ปุ่น", "จีน", "เกาหลี", "ยุโรป", "ตุรกี", "อเมริกา", "ฮ่องกง", "เวียดนาม", "ฟิลิปปินส์", "แอฟริกา"];

export default function PackagesPage() {
  const [priceRange, setPriceRange] = useState([200000]);
  const [country, setCountry] = useState("ทั้งหมด");
  const [duration, setDuration] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filteredPackages = useMemo(() => {
    return packages.filter((p) => {
      if (p.price > priceRange[0]) return false;
      if (country !== "ทั้งหมด" && p.country !== country) return false;
      if (duration === "short" && p.days > 5) return false;
      if (duration === "medium" && (p.days < 6 || p.days > 8)) return false;
      if (duration === "long" && p.days < 9) return false;
      return true;
    });
  }, [priceRange, country, duration]);

  const featuredPackages = packages.filter((p) => p.featured);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '15s' }} />

      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container">
          {/* Header */}
          <div className="mb-8 text-center">
            <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">
              <Globe className="h-3 w-3 mr-1" />
              Regent Holiday
            </Badge>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
              โปรแกรมทัวร์ต่างประเทศ
            </h1>
            <p className="font-body text-muted-foreground text-lg">
              ทัวร์คุณภาพคัดสรรพิเศษ จัดโดยทีมงานมืออาชีพ — เลือกทัวร์ที่ใช่สำหรับคุณ
            </p>
          </div>

          {/* Featured Tours */}
          {country === "ทั้งหมด" && !duration && priceRange[0] >= 165900 && (
            <div className="mb-10">
              <h2 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-primary fill-current" />
                ทัวร์ยอดนิยม
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {featuredPackages.map((pkg) => (
                  <a
                    key={pkg.id}
                    href={pkg.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-card rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all overflow-hidden"
                  >
                    <div className="aspect-square overflow-hidden relative">
                      <img
                        src={pkg.image}
                        alt={pkg.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs">
                        ยืนยันทันที
                      </Badge>
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-heading text-sm font-bold text-foreground line-clamp-2 leading-snug">
                        {pkg.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">{pkg.destination}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {pkg.days} วัน {pkg.nights} คืน
                        </span>
                        <span className="font-heading text-sm font-bold text-primary">
                          ฿{pkg.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className={`lg:w-64 shrink-0 space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
              <div className="bg-card p-6 rounded-2xl border border-border shadow-card space-y-6 sticky top-24">
                <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                  <Filter className="h-4 w-4" /> กรองทัวร์
                </h3>

                {/* Country filter */}
                <div className="space-y-2">
                  <label className="font-body text-sm text-muted-foreground">ประเทศ</label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger>
                      <SelectValue placeholder="ทั้งหมด" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price filter */}
                <div className="space-y-2">
                  <label className="font-body text-sm text-muted-foreground">ราคาสูงสุด</label>
                  <Slider value={priceRange} onValueChange={setPriceRange} min={10000} max={200000} step={5000} />
                  <p className="text-right text-sm font-semibold text-primary">฿{priceRange[0].toLocaleString()}</p>
                </div>

                {/* Duration filter */}
                <div className="space-y-2">
                  <label className="font-body text-sm text-muted-foreground">ระยะเวลา</label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder="ทั้งหมด" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทั้งหมด</SelectItem>
                      <SelectItem value="short">3-5 วัน</SelectItem>
                      <SelectItem value="medium">6-8 วัน</SelectItem>
                      <SelectItem value="long">9 วันขึ้นไป</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  พบ {filteredPackages.length} โปรแกรม
                </p>
              </div>
            </aside>

            <Button variant="outline" className="lg:hidden" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="mr-2 h-4 w-4" /> {showFilters ? "ซ่อนตัวกรอง" : "แสดงตัวกรอง"}
            </Button>

            {/* Package Cards */}
            <div className="flex-1 space-y-6">
              <h2 className="font-heading text-xl font-bold text-foreground">
                ทัวร์ทั้งหมด ({filteredPackages.length})
              </h2>

              {filteredPackages.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <Globe className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p className="font-heading text-lg">ไม่พบทัวร์ที่ตรงกับเงื่อนไข</p>
                  <p className="text-sm mt-1">ลองปรับตัวกรองใหม่</p>
                </div>
              )}

              {filteredPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-card rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all overflow-hidden flex flex-col md:flex-row group"
                >
                  <div className="md:w-72 lg:w-80 aspect-square md:aspect-auto overflow-hidden relative">
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <Badge className="absolute top-4 left-4 bg-background/90 text-foreground backdrop-blur-sm">
                      {pkg.country}
                    </Badge>
                  </div>
                  <div className="flex-1 p-6 md:p-8 space-y-4">
                    <h3 className="font-heading text-lg lg:text-xl font-bold text-foreground leading-snug line-clamp-2">
                      {pkg.name}
                    </h3>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground font-body flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {pkg.days} วัน {pkg.nights} คืน
                      </span>
                      <span className="flex items-center gap-1">
                        <Plane className="h-4 w-4" />
                        {pkg.airline}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {pkg.destination}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {pkg.highlights.map((h) => (
                        <Badge key={h} variant="secondary" className="text-xs">
                          {h}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div>
                        <span className="font-body text-sm text-muted-foreground">เริ่มที่</span>
                        <span className="font-heading text-2xl font-bold text-primary ml-2">
                          ฿{pkg.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <a href={pkg.link} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            ดูรายละเอียด
                          </Button>
                        </a>
                        <a href="https://lin.ee/5ANhUvT" target="_blank" rel="noopener noreferrer">
                          <Button variant="hero" size="sm">
                            จองผ่านไลน์
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
