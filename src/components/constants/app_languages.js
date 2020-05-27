// Object for use with languages throughout the app;
// Some constant files such as constants/docments.js and inspection.js have their own languages
// Rules: keys must be two three words (three max for disambiguation)
// that cononically describe the text on a page
//in camelCase; leave out a, the, to, or and other words, no colons
const appLanguages =
  {
    // header
    myPage: { en: 'My Page', jp: 'マイページ' },
    signIn: { en: 'Sign In', jp: 'ログイン' },
    signUp: { en: 'Sign Up', jp: 'ユーザー登録' },
    signOut: { en: 'Sign Out', jp: 'ログアウト' },
    signedIn: { en: 'Signed in as', jp: '' },
    // results
    size: { en: 'Size', jp: '床面積' },
    bedrooms: { en: 'Bedrooms', jp: '部屋数' },
    station: { en: 'Station', jp: '駅から' },
    price: { en: 'Price', jp: '家賃' },
    keyMoney: { en: 'Key Money', jp: '礼金' },
    deposit: { en: 'Deposit (months)', jp: '敷金(ヶ月)' },
    managementFees: { en: 'Mngmnt Fees (amount)', jp: '共益費(円)' },
    clearAll: { en: 'ClearAll', jp: '全てクリア' },
    apply: { en: 'Apply', jp: '適用' },
    refineSearch: { en: 'Refine Search', jp: '詳細検索' },
    mins: { en: 'mins', jp: '分' },
    searchAnotherCity: { en: 'Search another city...', jp: '他の街を検索...' },
    findFlats: { en: 'Find flats in a city...', jp: '街で物件を検索...' },
    close: { en: 'Close', jp: '閉じる' },
    noFlats: { en: 'There are no flats with that criteria.', jp: 'そのエリア・条件で物件はありませんでした。' },
    searchAnother: { en: 'Please search another.', jp: '他の条件でお探し下さい。' },
    search: { en: 'Search', jp: '' },
    searchByDates: { en: 'Filter by dates of your stay...', jp: '日程で絞り込み...' },
    reset: { en: 'Reset', jp: 'リセット' },
    finished: { en: 'Finished', jp: '選択終了' },
    // show flat
    availableAmenities: { en: 'Available Amenities', jp: '物件の特徴・設備' },
    selectRange: { en: 'Select range of dates you want', jp: ' 日程を指定' },
    selectFirst: { en: 'Please select first day ', jp: 'チェックイン日を指定' },
    selectLast: { en: 'Please select last day ', jp: 'チェックアウト日を指定' },
    selectFrom: { en: 'Selected From', jp: '指定された日程' },
    noNearby: { en: 'No nearby places selected', jp: 'まだオーナーによって選択されてません。' },
    messages: { en: 'Messages', jp: 'メッセージ' },
    message: { en: 'Message', jp: 'メッセージ' },
    reviews: { en: 'Reviews', jp: 'レビュー' },
    requestReservation: { en: 'Request Reservation', jp: '予約をリクエストする' },
    confirmReservationRequest: { en: 'Confirm Reservation Request', jp: '申し込みを確定' },
    blockDates: { en: 'Block Dates', jp: '日程をブロックする' },
    syncCalendar: { en: 'Update with iCal', jp: 'iCalカレンダーを反映' },
    addEditBuilding: { en: 'Add or Edit Building Information', jp: '建物情報を追加・編集' },
    editBuilding: { en: 'edit building', jp: '建物情報を編集' },
    addMyBuilding: { en: 'Add My Building', jp: 'この物件の建物を追加' },
    noAddMyBuilding: { en: 'No, Add My Building', jp: 'いいえ、この物件の建物を追加' },
    yesAssignThisBuilding: { en: 'Yes, assign this building to my listing', jp: 'はい、この建物を物件の建物として登録' },
    addInspection: { en: 'add inspection', jp: '検査情報を追加' },
    editInspection: { en: 'edit inspection', jp: '検査情報を編集' },
    addEditFacilties: { en: 'Add or Edit Facilities Information', jp: '建物の付属施設を追加・編集' },
    addAFacility: { en: 'Add a Facility', jp: '付属施設を追加' },
    addEditCalendars: { en: 'Add or Edit iCalendars', jp: 'iCalendarを追加・編集' },
    addedIcalendars: { en: 'Added iCalendars:', jp: '登録されたiCalendar:' },
    noIcalendarsAdded: { en: 'No iCalendars Added', jp: 'iCalendarが登録されてません' },
    addAnotherICalendar: { en: 'Add Another iCalendar', jp: 'iCalendarを登録する' },
    addAnICalendar: { en: 'Add an iCalendar', jp: 'iCalendarを登録する' },
    // landing
    bannerMessage: { en: 'Live the way you want', jp: '住みかたを選ぼう' },
    // edit create flat
    createListing: { en: 'Create a Listing', jp: '物件を登録' },
    editYourListing: { en: 'Edit Your Listing', jp: '物件の編集' },
    editBasicInformation: { en: 'Edit Basic Information and Amenities', jp: '基本情報及び設備の編集' },
    streetAddress: { en: 'Street Address', jp: '町村番地' },
    unit: { en: 'Unit', jp: '部屋番号' },
    city: { en: 'City', jp: '市区' },
    state: { en: 'State', jp: '都道府県' },
    zip: { en: 'Zip/Postal Code', jp: '郵便番号' },
    region: { en: 'Region', jp: '地域' },
    country: { en: 'Country', jp: '国名' },
    area: { en: 'Area', jp: 'エリア' },
    listedRent: { en: 'Rent (list)', jp: '家賃 (掲載)' },
    listedDeposit: { en: 'Deposit xMonths (list)', jp: '資金 (掲載)' },
    listedKeyMoney: { en: 'Key Money xMonths (list)', jp: '礼金 (掲載)' },
    description: { en: 'Description', jp: '物件の特徴' },
    salesPoint: { en: 'Sales Point', jp: 'セールスポイント' },
    pricePerMonth: { en: 'Price per Month', jp: '家賃 (月)' },
    month: { en: 'Month', jp: '月' },
    optional: { en: 'Optional', jp: 'オプショナル' },
    notOptional: { en: 'Not Optional', jp: 'オプショナルではない' },
    paymentDueDate: { en: 'Pay by day of month', jp: '支払い期日（毎月何日まで）' },
    floorSpace: { en: 'Floor Space m²', jp: '床面積 (m²)' },
    balconySize: { en: 'Balcony Size m²', jp: 'バルコニー面積 (m²)' },
    guests: { en: 'Guests', jp: '人数' },
    rooms: { en: 'Rooms', jp: '部屋数' },
    beds: { en: 'Beds', jp: 'ベッド数' },
    kingOrQueen: { en: 'King or Queen Beds', jp: 'キング・クイーンベッド' },
    flatType: { en: 'Property Type', jp: '物件タイプ' },
    layout: { en: 'Flat Layout', jp: '間取り' },
    bath: { en: 'Bath', jp: 'バス' },
    toilet: { en: 'Toilet', jp: 'トイレ' },
    intro: { en: 'Intro', jp: '物件紹介' },
    nearestStation: { en: 'Nearest Station', jp: '最寄駅' },
    minutesToNearest: { en: 'Mins to Nearest Station', jp: '最寄り駅徒歩' },
    nearestStation2: { en: '2nd Nearest Station', jp: '次の最寄駅' },
    cancellation: { en: 'Cancellation', jp: 'キャンセル' },
    parkingIncluded: { en: 'Parking Included', jp: '駐車場込み' },
    bicycleParkingIncluded: { en: 'Bicycle Park Included', jp: '自転置場込み' },
    motorcycleParkingIncluded: { en: 'Motorcyle Park Included', jp: 'バイク置場込み' },
    storageIncluded: { en: 'Storage Included', jp: '置物' },
    dedicatedYard: { en: 'Own Yard', jp: '専用庭' },
    smoking: { en: 'Smoking', jp: '喫煙' },
    icalExplain: { en: 'To update calendar with iCal for this flat, copy url of .ics file from Google Calendar or other listing apps and paste here', jp: 'この物件のカレンダーをiCalカレンダーでアップデートするには、Googleカレンダーや他の賃貸アプリの.ics形式ファイルをコピーして、ここに貼り付けて下さい。' },
    icalImport: { en: 'iCalendar URL', jp: 'iCalendar URL' },
    confirmAbove: { en: 'Confirm above changes and submit', jp: '上記を確認して送信' },
    submit: { en: 'Submit', jp: '送信' },
    update: { en: 'Update', jp: 'アップデート' },
    deleteImagesAdd: { en: 'Delete images to add', jp: '追加するには画像を削除して下さい。' },
    addEditLanguages: { en: 'Add or Edit Languages', jp: '言語を追加・編集' },
    baseLanguage: { en: 'Base Language', jp: 'ベースの言語' },
    availableLanguages: { en: 'Available Languages', jp: '追加済みの言語' },
    noOtherLanguages: { en: 'No other languages added.', jp: '他の言語は追加されてません。' },
    addAnotherLanguage: { en: 'Add Another Language', jp: '言語を追加する' },
    addDeletePhotos: { en: 'Add or Delete Photos', jp: '画像を追加・削除  ' },
    deleteCheckedImages: { en: 'Delete checked images', jp: '✔した写真を全て削除' },
    uncheckAllImages: { en: 'Uncheck all images', jp: '✔を全て解除' },
    checkAllImages: { en: 'Check all images', jp: '全てを✔︎' },
    images: { en: 'Images', jp: '枚の写真' },
    addDeleteConvenient: { en: 'Add or Delete Convenient Places Near Your Flat',
      jp: '物件周辺の便利な場所を追加・削除' },
    searchNearest: { en: 'Search for Nearest', jp: '近所を検索' },
    schools: { en: 'Schools', jp: '学校' },
    convenientStores: { en: 'Convenient Stores', jp: 'コンビニ' },
    superMarkets: { en: 'Super Markets', jp: 'スーパーマーケット' },
    trainStations: { en: 'Train Stations', jp: '電車の駅' },
    subwayStations: { en: 'Subway Stations', jp: '地下鉄の駅' },
    selectTypePlace: { en: 'Select Type of Place Nearby', jp: '施設をタイプ別で検索' },
    searchPlaceName: { en: 'Search for place name or address', jp: '施設を名前や住所で検索' },
    topSearchResults: { en: 'Top Search Results', jp: '主な検索結果' },
    searchResultsMessage: { en: 'To get nearby places, click on criterion under "Search for Nearest," then click the "add" button to add it to your list so that users can see it on the show page.',
      jp: '近くの施設を検索するには、「近所の施設」の下にある条件をクリックして「追加」のボタンを押すとリストに加えられます。' },
    nearbyPlaces: { en: 'Nearby Places', jp: '近所の便利な施設' },
    noNearbyPlaces: { en: 'No nearby places listed', jp: '施設が選択されてません。' },
    toShowPage: { en: 'To Show Page', jp: '物件詳細へ' },
    add: { en: 'Add', jp: '追加' },
    remove: { en: 'Remove', jp: '削除' },
    yes: { en: 'Yes', jp: '可' },
    yesSeePolicies: { en: 'Yes -- see policies for details', jp: '可 -- ポリシーを参照' },
    no: { en: 'No', jp: '不可' },
    // createFlat
    dropImages: { en: 'Drop your images or\n click here \nto upload ', jp: '写真をここにドロップ\n又は、クリックして\nアップロード' },
    requiredFields: { en: 'Required fields -- other fields can be filled-in on the edit page',
      jp: '必須　ー　他の欄についてはエディットページで編集できます。' },
    requiredFieldsEdit: { en: 'Required fields -- if you need to edit the address, delete flat and start a new one', jp: '必須項目 -- 住所を編集する必要が有りましたら、物件を削除して新たな物件をご登録下さい。' },
    // my page
    myLikes: { en: 'My Likes', jp: 'お気に入りの物件' },
    myFlats: { en: 'My Flats', jp: 'My物件' },
    myProfile: { en: 'My Profile', jp: 'Myプロファイル' },
    myBookings: { en: 'My Bookings', jp: 'My予約' },
    checkIn: { en: 'Check in', jp: 'チェックイン' },
    checkOut: { en: 'Check out', jp: 'チェックアウト' },
    edit: { en: 'edit', jp: '編集' },
    delete: { en: 'delete', jp: '削除' },
    bookingsMyFlats: { en: 'Bookings for My Flats', jp: 'My物件の予約' },
    paymentDetails: { en: 'Payment Details', jp: 'お支払い関係' },
    bankAccountDetails: { en: 'Bank Accounts', jp: '銀行口座の情報' },
    addNewBankAccount: { en: 'Add New Bank Account', jp: '銀行講座の追加' },
    accountName: { en: 'Account Name', jp: '口座名義' },
    bankName: { en: 'Bank Name', jp: '銀行名' },
    accountNumber: { en: 'Account Number', jp: '口座番号' },
    accountType: { en: 'Account Type', jp: '預金' },
    ordinary: { en: 'Ordinary', jp: '普通' },
    current: { en: 'Current', jp: '当座' },
    rentPayment: { en: 'Rent Payments', jp: '家賃の支払' },
    selectBankAccount: { en: 'Select Bank Account for Rent Payment', jp: '家賃支払い先の口座を選ぶ' },
    selectBankAccountMessage: { en: 'Click on the check box to select a bank account', jp: 'チェックボックスをクリックして口座を選択して下さい。' },
    lastFour: { en: 'Last four digits', jp: '下４桁' },
    expiration: { en: 'Exp', jp: '有効期限' },
    noCards: { en: 'You have no cards on file. Please add card', jp: 'カードがありません。追加をお願いします。' },
    addNewCard: { en: 'Add New Card', jp: 'カードの追加' },
    connectBank: { en: 'Connect your bank account', jp: '銀行口座をリンク' },
    useThisCard: { en: 'Use this card for payment', jp: 'このカードを支払いに使用' },
    removeProfilePicture: { en: 'Remove profile picture', jp: 'プロファイル写真を削除' },
    changeProfilePicture: { en: 'Change profile picture', jp: 'プロファイル写真を変更' },
    userName: { en: 'User name', jp: 'ユーザーネーム' },
    userId: { en: 'User ID', jp: 'ユーザーID' },
    title: { en: 'Title', jp: '称号' },
    firstName: { en: 'First Name', jp: '名' },
    lastName: { en: 'Last Name', jp: '姓名' },
    birthday: { en: 'Birthday', jp: '生年月日' },
    address: { en: 'Address', jp: '住所' },
    selfIntro: { en: 'Self Intro', jp: '自己紹介' },
    emergencyName: { en: 'Emergency Contact Name', jp: '緊急連絡先の名前' },
    emergencyPhone: { en: 'Emergency Contact Phone', jp: '緊急連絡先の電話番号' },
    emergencyAddress: { en: 'Emergency Contact Address', jp: '緊急連絡先の住所' },
    emergencyRelationship: { en: 'Emergency Contact Relationship', jp: '緊急連絡先との関係' },
    listNewFlat: { en: 'Create a new listing!', jp: '新しい物件を登録' },
    noMyLiked: { en: 'You do not have any liked flats', jp: 'お気に入りはまだありません。' },
    noMyBooking: { en: 'You do not have any bookings', jp: '予約はまだありません。' },
    noMyListings: { en: 'You do not have any listings', jp: '登録物件はまだありません。' },
    noMyBooked: { en: 'There are no bookings for your flats', jp: '予約はまだありません。' },
    // main message
    archives: { en: 'Archives', jp: '保管箱' },
    trashBin: { en: 'Trash Bin', jp: 'ゴミ箱' },
    archivedMessages: { en: 'Archived Messages', jp: '保管箱' },
    moveToArchives: { en: 'Move to archives', jp: '保管箱に入れる' },
    unarchive: { en: 'Unarchive', jp: 'メインに戻す' },
    untrash: { en: 'Untrash', jp: 'もとに戻す' },
    deleteCompletely: { en: 'Delete', jp: '完全に消去' },
    enterMessage: { en: 'Enter your message here', jp: 'メッセージを入力' },
    filterKeyWords: { en: 'Filter by key words...', jp: 'キーワードで絞り込む...' },
    filterListing: { en: 'Filter by listing...', jp: '物件で絞り込む...' },
    allListings: { en: 'All listings', jp: '全ての物件' },
    messageDateOldest: { en: 'Message Date (oldest)', jp: '日付で並べる(昇順)' },
    messageDateNewest: { en: 'Message Date (newest)', jp: '日付で並べる(降順)' },
    orderBy: { en: 'Order by', jp: '並べを変える' },
    send: { en: 'Send', jp: '送信' },
    noConversation: { en: 'You have not started a conversation with the owner... \nStart one by sending a message! \nMake sure to introduce yourself',
      jp: 'まだコンバセーションを始めてません。\n  メッセージを送って始めましょう。\n　自己紹介を忘れない様に。' },
    // edit profile
    noConversationsYet: { en: 'You have no conversations.', jp: 'まだメッセージはありません。' },
    editProfile: { en: 'Edit Profile', jp: 'プロフィールの編集' },
    createProfile: { en: 'Create Profile', jp: 'プロフィールの作成' },
    // payment modal
    makePayment: { en: 'Make a Payment', jp: 'お支払い' },
    paymentAmount: { en: 'Payment Amount', jp: 'お支払い額' },
    currency: { en: 'Currency', jp: 'お支払い通貨' },
    notes: { en: 'Notes', jp: '備考' },
    addCard: { en: 'Add a Card', jp: 'カードの追加' },
    editCard: { en: 'Edit Card', jp: 'カード情報の編集' },
    nameCard: { en: 'Name on Card', jp: 'カード名義' },
    expiryYear: { en: 'Expiry Year', jp: '有効期限年' },
    expiryMonth: { en: 'Expiry Month', jp: '有効期限月' },
    addOption: { en: 'Add Option', jp: '追加する' },
    deleteOption: { en: 'Delete Option', jp: '削除する' },
    firstMonthRent: { en: 'First Month Rent', jp: '初月の家賃' },
    depositForRequest: { en: 'Deposit', jp: '敷金' },
    rent: { en: 'Rent', jp: '家賃' },
    monthForRequest: { en: 'Month', jp: 'ヶ月' },
    firstMonthFacility: { en: 'First Month Facility Fees (parking, etc)', jp: '初月の施設使用料' },
    facilityDeposit: { en: 'Facilities Deposit', jp: '施設の敷金' },
    others: { en: 'Others', jp: 'その他' },
    bookingRequest: { en: 'Make a Booking Request', jp: '賃貸のお申し込み' },
    monthlyRent: { en: 'Monthly Rent', jp: '家賃(月)' },
    facilityFees: { en: 'Facility Fees (parking, etc)', jp: '施設使用料(駐車場など)' },
    managementFeesForRequest: { en: 'Management Fees', jp: '管理費' },
    totalMonthlyPayments: { en: 'Total Monthly Payments', jp: '月々のお支払い額' },
    initialPayment: { en: 'Due at Contract Signing', jp: 'ご成約時のお支払い額' },
    bookingInfo: { en: 'Booking Information', jp: 'お申し込みの内容' },
    bookingFrom: { en: 'Booking From', jp: '賃貸開始日' },
    bookingTo: { en: 'Booking To', jp: '賃貸終了日' },
    facilities: { en: 'Facilities', jp: '付属施設' },
    priceIncluded: { en: 'Price Included', jp: '施設込み' },
    pricePerMonthForRequest: { en: 'Price per Month', jp: '月額' },
    basicInfoForTenant: { en: 'Basic Information for Tenant', jp: '契約者の基本情報' },
    inCaseOfEmergency: { en: 'In Case of Emergency', jp: '緊急連絡先' },
    otherTenants: { en: 'Other Tenants', jp: '同居人の情報' },
    firstNameError: { en: 'A first name is required', jp: '名は必須です。' },
    lastNameError: { en: 'A last name is required', jp: '名字は必須です。' },
    birthdayError: { en: 'A birthday is required', jp: '誕生日は必須です。' },
    address1Error: { en: 'A street address is required', jp: '番地町村は必須です。' },
    cityError: { en: 'A city is required', jp: '区市は必須です。' },
    stateError: { en: 'A state is required', jp: '都道府県は必須です。' },
    zipError: { en: 'A zip is required', jp: '郵便番号は必須です。' },
    countryError: { en: 'A country is required', jp: '国名は必須です。' },
    emergencyNameError: { en: 'An emergency contact name is required', jp: '緊急連絡先の名前は必須です。' },
    emergencyPhoneError: { en: 'An emergency contact phone is required', jp: '緊急連絡先の電話番号は必須です。' },
    emergencyAddressError: { en: 'An emergency contact address is required', jp: '緊急連絡先の住所は必須です。' },
    emergencyRelationshipError: { en: 'An relationship with the emergency contact is required', jp: '緊急連絡先とのご関係は必須です。' },
    searchOutputLanguage: { en: 'Search Output Language', jp: '検索結果の言語' },
    bookingRequestWorkspace: { en: 'Booking Request Workspace', jp: '契約ワークスペース' },
    minutes: { en: ' minutes', jp: '分' },
    meters: { en: ' meters', jp: 'メートル' },
    addNewContractor: { en: 'Add a New Contrator', jp: 'コントラクターを追加' },
    contractors: { en: 'Contrators', jp: 'コントラクター' },
    createContractor: { en: 'Create Contrator', jp: 'コントラクターを作成' },
    addContractorLanguage: { en: 'Add Contrator Language', jp: 'コントラクターの言語を追加' },
    companyName: { en: 'Company Name', jp: '会社名' },
    contractorType: { en: 'Contractor Type', jp: 'コントラクタータイプ' },
    staff: { en: 'Staff', jp: 'スタッフ' },
    addNewStaff: { en: 'Add New Staff', jp: 'スタッフを追加' },
    viewStaff: { en: 'view staff', jp: 'スタッフ' },
    addLanguage: { en: 'Add Language', jp: '言語を追加' },
    language: { en: 'Language', jp: '言語' },
    listingLanguage: { en: 'Listing Language', jp: '物件登録の言語' },
    addBuildingLanguage: { en: 'Add Building Language', jp: '建物の言語を追加' },
    inspections: { en: 'Inspections', jp: '建物の検査情報' },
    inspection: { en: 'Inspection', jp: '建物の検査' },
    otherLanguages: { en: 'Other Languages', jp: '他の言語' },
    editBuildingLanguage: { en: 'Edit Building Language', jp: '建物の言語を編集' },
    createBuildingLanguage: { en: 'Create Building Language', jp: '建物の言語を作成' },
    createPdf: { en: 'create pdf', jp: 'PDFを作成' },
    viewPdf: { en: 'view pdf', jp: 'PDFをみる' },
    updatePdf: { en: 'update pdf', jp: 'PDFを更新' },
    save: { en: 'save', jp: '保存' },
    ifOwnerDifferent: { en: 'Owner is titleholder of listed property. Fill in only if owner is different from user', jp: '物件の所有者。ユーザーが物件の所有者では無い場合。' },
    cityState: { en: 'City/State', jp: '市・都道府県' },
    dateStart: { en: 'Date Start', jp: '開始日' },
    dateEnd: { en: 'Date End', jp: '終了日' },
    bookingId: { en: 'Booking ID', jp: '予約ID' },
    listingId: { en: 'Listing ID', jp: '物件ID' },
    age: { en: 'Age', jp: '年齢' },
    tenantFrom: { en: 'From', jp: '在住' },
    numberTenants: { en: 'Number of Tenants', jp: 'テナント数' },
    introduction: { en: 'Introduction', jp: '自己紹介' },
    basicBookingRequestInformation: { en: 'Basic Booking Request Information', jp: '予約情報' },
    proposedTenantInformation: { en: 'Proposed Tenant Information', jp: '申込者情報' },
    rentalDocuments: { en: 'Rental Documents', jp: '賃貸関連の契約書' },
    rentalActions: { en: 'Rental Actions', jp: 'アクション' },
    createDocuments: { en: 'Create Documents', jp: 'ドキュメント作成' },
    savedDocuments: { en: 'Saved Documents', jp: '保存済みのドキュメント' },
    approveBookingRequest: { en: 'Approve Booking Request', jp: '申込みを承認' },
    rentalProgress: { en: 'Rental Progress', jp: '進捗状況' },
    reservationRequest: { en: 'Reservation Request', jp: '予約のリクエスト' },
    tenantApproved: { en: 'Tenant Approved', jp: '申込みの承認' },
    documentsSent: { en: 'Documents Sent', jp: '契約書送付済み' },
    documentsSigned: { en: 'Signed!', jp: '契約書締結済み' },
    attachments: { en: 'Attachments', jp: '添付書類' },
    inserts: { en: 'Inserts', jp: '挿入書類' },
    insertDocuments: { en: 'Insert Documents', jp: '書類を挿入' },
    uploadPdf: { en: 'Upload PDF', jp: 'PDFをアップロード' },
    createDocumentInsert: { en: 'Create Document Insert', jp: '挿入ドキュメントを作成' },
    createTemplateDocument: { en: 'Create Template Document', jp: 'テンプレート・ドキュメントを作成' },
    editTemplateDocument: { en: 'Edit Template Document', jp: 'テンプレート・ドキュメントを編集' },
    createInsertField: { en: 'Create Insert Field', jp: 'フィールドを作成' },
    editInsertField: { en: 'Edit Insert Field', jp: 'フィールドを編集' },
    editDocumentInsert: { en: 'Edit Document Insert', jp: '挿入ドキュメントを編集' },
    insertField: { en: 'insert field', jp: 'フィールドを追加' },
    insertOwnAgreement: { en: 'Insert Your Own Agreement', jp: '自分の契約書を挿入' },
    download: { en: 'Download', jp: 'ダウンロード' },
    useOwnInsert: { en: 'Use Own Insert', jp: '自分の契約書を使用' },
    included: { en: 'Included', jp: '込み' },
    monthAbbreviated: { en: 'mo', jp: '月' },
    depositAbbreviated: { en: 'Dep', jp: '敷金' },
    sendDocumentsEmail: { en: 'Email Documents to Tenant', jp: 'テナントに書類をメールする' },
    emailDocuments: { en: 'Email Documents', jp: '書類をメール' },
    finalRent: { en: 'Final Rent', jp: '家賃（最終)' },
    finalDeposit: { en: 'Final Deposit xMonths', jp: '敷金（最終)' },
    finalKeyMoney: { en: 'Final Key Money xMonths', jp: '礼金（最終)' },
    updateFinalTerms: { en: 'Update Final Terms', jp: '最終条件を更新' },
    yesTrue: { en: 'Yes', jp: 'はい' },
    noFalse: { en: 'No', jp: 'いえ' },
    importantPointsExplanationDone: { en: 'I received the important points explanation', jp: '重要事項説明を受けました' },
    // rentalDocuments: { en: 'Rental Documents', jp: '賃貸関連書類' },
    documentsSignedButton: { en: 'Documents Signed', jp: '書類完了' },
    signedDocuments: { en: 'Signed Documents', jp: '賃貸書類手続き完了' },
    sendDocuments: { en: 'Send Documents', jp: '書類をメールする' },
    markDocumentsSigned: { en: 'Mark Documents as Signed', jp: '書類を署名済みとする' },
    approved: { en: 'Approved', jp: '承認済み' },
    approve: { en: 'Approve', jp: '承認する' },
    contactLandlord: { en: 'Contact Landlord', jp: '家主に連絡する' },
    contactTenant: { en: 'Contact Tenant', jp: 'テナントに連絡する' },
    sendMessage: { en: 'Send Message', jp: 'メッセージを送る' },
    openMessaging: { en: 'Open Messaging', jp: 'メッセージングを開く' },
    enterMessageToTenant: { en: 'Enter Message', jp: 'メッセージを作成' },
    cancelApprovalBooking: { en: 'Cancel approval of booking request?', jp: '予約の承認を取り消しますか？' },
    approvalBooking: { en: 'Approval booking request?', jp: '予約を承認しますか？' },
    endRental: { en: 'Yes, end it', jp: '賃貸を終了' },
    endRentalLine: { en: 'Conclude Rental', jp: '賃貸を終了' },
    undo: { en: 'Undo', jp: '終了取り消し' },
    templates: { en: 'Templates', jp: 'テンプレート' },
    uploadDocument: { en: 'Upload Your Document', jp: 'ドキュメントをアップロード' },
    uploadTemplate: { en: 'Upload Your Template', jp: 'テンプレートをアップロード' },
    messageOwner: { en: 'Send a Message', jp: 'メッセージしよう' },
    noNearbyPlaces: { en: 'No places selected. Go to Edit page and to choose places nearby your flat.', jp: 'プレースが選択されてません。編集ページで物件の近くのプレースを選択してください。' },
    signOutMessage: { en: 'You have been signed out. \n\n Please come back soon!', jp: 'ログアウトしました。\n\nまたのご使用をお待ち申し上げております。' },
    // Template Elements
    document: { en: 'Document', jp: 'ドキュメント' },
    tenant: { en: 'Tenant', jp: 'テナント' },
    broker: { en: 'Broker', jp: '仲介業者' },
    building: { en: 'Building', jp: '建物' },
    flat: { en: 'Listing', jp: '物件' },
    landlord: { en: 'Landlord', jp: '家主' },
    owner: { en: 'Owner', jp: '所有者' },
    agreement: { en: 'Agreement', jp: '契約内容' },
    inspection: { en: 'Inspection', jp: '点検' },
    management: { en: 'Management', jp: '管理会社' },
    amenities: { en: 'Amenities', jp: '設備' },
    fromDate: { en: 'From Date', jp: '開始日' },
    toDate: { en: 'To Date', jp: '終了日' },
    noticeTo: { en: 'Notice To Date', jp: '通知期間の終了日' },
    noticeFrom: { en: 'Notice From Date', jp: '通知期間の開始日' },
    agreementDate: { en: 'Agreement Date', jp: '契約日' },
    emergencyContact: { en: 'Emergency Contact', jp: '緊急連絡先' },
    guarantor: { en: 'Guarantor', jp: '保証人' },
    brokerLicenseNumber: { en: 'Broker License No.', jp: '仲介業者の免許番号' },
    brokerStaff: { en: 'Broker Staff', jp: '仲介業者・担当者' },
    documentDate: { en: 'Document Date', jp: '書類制作日' },
    bond: { en: 'Bond', jp: '営業保証金' },
    guaranty: { en: 'Guaranty', jp: '弁済業務保証金' },
    waterDate: { en: 'Water Availability Date', jp: '水道整備予定日' },
    electricityDate: { en: 'Electricity Availability Date', jp: '電気整備予定日' },
    gasDate: { en: 'Gas Availability Date', jp: 'ガス整備予定日' },
    sewageDate: { en: 'Sewage Availability Date', jp: '排水整備予定日' },
    asbestos: { en: 'Asbestos', jp: 'アスベスト' },
    earthQuake: { en: 'Earthquake Study', jp: '耐震診断' },
    buildingManagement: { en: 'Building Management', jp: '管理会社' },
    kitchen: { en: 'Kitchen', jp: '台所' },
    // toilet: { en: 'Toilet', jp: 'トイレ' },
    bathTub: { en: 'Bathtub', jp: 'バスタブ' },
    hotWater: { en: 'Water Heater', jp: '給湯器' },
    kitchenGrill: { en: 'Kitchen Stove', jp: 'キッチンストーブ' },
    ac: { en: 'A/C', jp: 'エアコン' },
    contractPeriodFrom: { en: 'Contract Period From', jp: '契約開始日' },
    contractPeriodTo: { en: 'Contract Period To', jp: '契約終了日' },
    contractPeriodLength: { en: 'Contract Period Length', jp: '契約期間' },
    construction: { en: 'Construction', jp: '構造' },
    architect: { en: 'Architect', jp: '建築事務所' },
    inspector: { en: 'Inspector', jp: '検査' },
    inspectedParts: { en: 'Inspected Parts', jp: '検査した部分' },
    otherPayments: { en: 'Non-rent Payments', jp: '家賃以外の支払い額' },
    name: { en: 'Name', jp: '名前' },
    degradations: { en: 'Degradations', jp: '劣化部分' },
    amenity: { en: 'Amenities', jp: '設備' },
    utilities: { en: 'Utilities', jp: 'ガス・電気・水道など' },
    legal: { en: 'Legal', jp: '法規制' },
    hazards: { en: 'Hazards Related', jp: '災害地域・アスベスト等' },
    // publicGas: { en: 'Public Gas', jp: 'ガス会社' },
    // propaneGas: { en: 'Propane Gas', jp: 'プロパンガス' },
    // none: { en: 'None', jp: 'なし' },
    // noticeFrom: { en: 'Notice From Date', jp: '通知期間の開始日' },

  };

export default appLanguages;
