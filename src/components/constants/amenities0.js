// Object for rendering amenities in respective appLanguageCode;
// Corresponds to attributes in the Amenity model in the api.
// Need to add if attribute added in api

const Amenities = {
    lockbox: { en: 'Lock box', jp: '金庫' },
    auto_lock: { en: 'Auto Lock', jp: 'オートロック' },
    security_system: { en: 'Security System', jp: '防犯システム' },
    lock_key: { en: 'Door Lock', jp: '鍵' },
    fire_extinguisher: { en: 'Fire Extinguisher', jp: '消火器' },
    mail_box: { en: 'Mail Box', jp: '郵便箱' },
    parcel_delivery_box: { en: 'Parcel Box', jp: '宅配ボックス' },
    parking: { en: 'Parking', jp: '駐車場' },
    ac: { en: 'A/C', jp: 'エアコン' },
    heater: { en: 'Heater', jp: 'ヒーター' },
    lighting_fixed: { en: 'Fixed Lighting', jp: '備付け照明器具' },
    wifi: { en: 'Wifi', jp: 'Wifi' },
    pocket_wifi: { en: 'Pocket Wifi', jp: 'ポケットWifi' },
    internet_ready: { en: 'Internet Ready', jp: 'インターネット対応' },
    wheelchair_accessible: { en: 'Wheelchair Accessible', jp: '車椅子アクセス' },
    bath_essentials: { en: 'Bath Essentials', jp: '洗面用具' },
    hot_water: { en: 'Hot Water', jp: '湯沸かし器' },
    hairdryer: { en: 'Hair Dryer', jp: 'ヘアドライヤー' },
    bath_tub: { en: 'Bath Tub', jp: '湯船' },
    shower: { en: 'Shower', jp: 'シャワー' },
    wash_basin: { en: 'Wash Basin', jp: '洗面台' },
    washlet: { en: 'Washlet', jp: 'ウォッシュレット' },
    tv: { en: 'TV', jp: 'テレビ' },
    cable_tv: { en: 'Digital/CATV Ready', jp: 'ディジタル・CATV 対応' },
    dvd_player: { en: 'DVD Player', jp: 'DVDプレーヤー' },
    sofa: { en: 'Sofa', jp: 'ソファー' },
    crib: { en: 'Crib', jp: 'ベビーベッド' },
    high_chair: { en: 'High Chair', jp: 'ハイチェア' },
    kitchen: { en: 'Kitchen', jp: 'キッチン' },
    kitchen_grill: { en: 'Kitchen Stove', jp: 'ガス・電気調理器' },
    oven: { en: 'Oven', jp: 'オーブン' },
    cooking_basics: { en: 'Cooking Basics', jp: 'クッキング用具' },
    eating_utensils: { en: 'Eating Utensils', jp: '食器' },
    microwave: { en: 'Microwave', jp: '電子レンジ' },
    refrigerator: { en: 'Refrigerator', jp: '冷蔵庫' },
    dish_washer: { en: 'Dish Washer', jp: '皿洗い機' },
    dining_table: { en: 'Dining Table', jp: 'テーブル' },
    washer: { en: 'Washer', jp: '洗濯機' },
    washer_dryer_area: { en: 'Washer Dryer Area', jp: '洗濯機置き場' },
    dryer: { en: 'Dryer', jp: 'ドライヤー' },
    iron: { en: 'Iron', jp: 'アイロン' }
};

export default Amenities;
