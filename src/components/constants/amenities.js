// Object for rendering amenities in respective appLanguageCode;
// Corresponds to attributes in the Amenity model in the api.
// Need to add if attribute added in api
// import AmenitiesChoices from './amenities_choices.js';
const AmenitiesChoices = {
    0: { value: true, en: 'Yes', jp: '有り', type: 'boolean', className: 'form-rectangle' },
    1: { value: false, en: 'None', jp: '無し', type: 'boolean', className: 'form-rectangle' }
};

const Amenities = {
    lockbox: {
      name: 'lockbox',
      en: 'Lock box',
      jp: '金庫',
      choices: AmenitiesChoices,
    },
    auto_lock: {
      name: 'auto_lock',
      en: 'Auto Lock',
      jp: 'オートロック',
      choices: AmenitiesChoices,
    },
    security_system: {
      name: 'security_system',
      en: 'Security System',
      jp: '防犯システム',
      choices: AmenitiesChoices,
    },
    lock_key: {
      name: 'lock_key',
      en: 'Door Lock',
      jp: '鍵' },
    fire_extinguisher: {
      name: 'fire_extinguisher',
      en: 'Fire Extinguisher',
      jp: '消火器',
      choices: AmenitiesChoices,
    },
    mail_box: {
      name: 'mail_box',
      en: 'Mail Box',
      jp: '郵便箱',
      choices: AmenitiesChoices,
    },
    parcel_delivery_box: {
      name: 'parcel_delivery_box',
      en: 'Parcel Box',
      jp: '宅配ボックス',
      choices: AmenitiesChoices,
    },
    parking: {
      name: 'parking',
      en: 'Parking',
      jp: '駐車場',
      choices: AmenitiesChoices,
    },
    ac: {
      name: 'ac',
      en: 'A/C',
      jp: 'エアコン',
      choices: AmenitiesChoices,
    },
    heater: {
      name: 'heater',
      en: 'Heater',
      jp: 'ヒーター',
      choices: AmenitiesChoices,
    },
    lighting_fixed: {
      name: 'lighting_fixed',
      en: 'Fixed Lighting',
      jp: '備付け照明器具',
      choices: AmenitiesChoices,
    },
    wifi: {
      name: 'wifi',
      en: 'Wifi',
      jp: 'Wifi',
      choices: AmenitiesChoices,
    },
    pocket_wifi: {
      name: 'pocket_wifi',
      en: 'Pocket Wifi',
      jp: 'ポケットWifi',
      choices: AmenitiesChoices,
    },
    internet_ready: {
      name: 'internet_ready',
      en: 'Internet Ready',
      jp: 'インターネット対応',
      choices: AmenitiesChoices,
    },
    wheelchair_accessible: {
      name: 'wheelchair_accessible',
      en: 'Wheelchair Accessible',
      jp: '車椅子アクセス',
      choices: AmenitiesChoices,
    },
    bath_essentials: {
      name: 'bath_essentials',
      en: 'Bath Essentials',
      jp: '洗面用具',
      choices: AmenitiesChoices,
    },
    hot_water: {
      name: 'hot_water',
      en: 'Hot Water',
      jp: '湯沸かし器',
      choices: AmenitiesChoices,
    },
    hairdryer: {
      name: 'hairdryer',
      en: 'Hair Dryer',
      jp: 'ヘアドライヤー',
      choices: AmenitiesChoices,
    },
    bath_tub: {
      name: 'bath_tub',
      en: 'Bath Tub',
      jp: '湯船',
      choices: AmenitiesChoices,
    },
    shower: {
      name: 'shower',
      en: 'Shower',
      jp: 'シャワー',
      choices: AmenitiesChoices,
    },
    wash_basin: {
      name: 'wash_basin',
      en: 'Wash Basin',
      jp: '洗面台',
      choices: AmenitiesChoices,
    },
    washlet: {
      name: 'washlet',
      en: 'Washlet',
      jp: 'ウォッシュレット',
      choices: AmenitiesChoices,
    },
    tv: {
      name: 'tv',
      en: 'TV',
      jp: 'テレビ',
      choices: AmenitiesChoices,
    },
    cable_tv: {
      name: 'cable_tv',
      en: 'Digital/CATV Ready',
      jp: 'ディジタル・CATV 対応',
      choices: AmenitiesChoices,
    },
    dvd_player: {
      name: 'dvd_player',
      en: 'DVD Player',
      jp: 'DVDプレーヤー',
      choices: AmenitiesChoices,
    },
    sofa: {
      name: 'sofa',
      en: 'Sofa',
      jp: 'ソファー',
      choices: AmenitiesChoices,
    },
    crib: {
      name: 'crib',
      en: 'Crib',
      jp: 'ベビーベッド',
      choices: AmenitiesChoices,
    },
    high_chair: {
      name: 'high_chair',
      en: 'High Chair',
      jp: 'ハイチェア',
      choices: AmenitiesChoices,
    },
    kitchen: {
      name: 'kitchen',
      en: 'Kitchen',
      jp: 'キッチン',
      choices: AmenitiesChoices,
    },
    kitchen_grill: {
      name: 'kitchen_grill',
      en: 'Kitchen Stove',
      jp: 'ガス・電気調理器',
      choices: AmenitiesChoices,
    },
    oven: {
      name: 'oven',
      en: 'Oven',
      jp: 'オーブン',
      choices: AmenitiesChoices,
    },
    cooking_basics: {
      name: 'cooking_basics',
      en: 'Cooking Basics',
      jp: 'クッキング用具',
      choices: AmenitiesChoices,
    },
    eating_utensils: {
      name: 'eating_utensils',
      en: 'Eating Utensils',
      jp: '食器',
      choices: AmenitiesChoices,
    },
    microwave: {
      name: 'microwave',
      en: 'Microwave',
      jp: '電子レンジ',
      choices: AmenitiesChoices,
    },
    refrigerator: {
      name: 'refrigerator',
      en: 'Refrigerator',
      jp: '冷蔵庫',
      choices: AmenitiesChoices,
    },
    dish_washer: {
      name: 'dish_washer',
      en: 'Dish Washer',
      jp: '皿洗い機',
      choices: AmenitiesChoices,
    },
    dining_table: {
      name: 'dining_table',
      en: 'Dining Table',
      jp: 'テーブル',
      choices: AmenitiesChoices,
    },
    washer: {
      name: 'washer',
      en: 'Washer',
      jp: '洗濯機',
      choices: AmenitiesChoices,
    },
    washer_dryer_area: {
      name: 'washer_dryer_area',
      en: 'Washer Dryer Area',
      jp: '洗濯機置き場',
      choices: AmenitiesChoices,
    },
    dryer: {
      name: 'dryer',
      en: 'Dryer',
      jp: 'ドライヤー',
      choices: AmenitiesChoices,
    },
    iron: {
      name: 'iron',
      en: 'Iron',
      jp: 'アイロン',
      choices: AmenitiesChoices,
    }
};

export default Amenities;
