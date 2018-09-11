//Rules: keys must be two three words (three max for disambiguation) that cononically describe the text on a page
//in camelCase; leave out a, the, to, or and other words, no colons
const appLanguages =
  {
    // header
    myPage: { en: 'My Page', jp: 'マイページ' },
    signIn: { en: 'Sign In', jp: 'ログイン' },
    signOut: { en: 'Sign Out', jp: 'ログアウト' },
    signedIn: { en: 'Signed in as', jp: '' },
    // results
    size: { en: 'Size', jp: '床面積' },
    bedrooms: { en: 'Bedrooms', jp: '部屋数' },
    station: { en: 'Station', jp: '駅から' },
    price: { en: 'Price', jp: '家賃' },
    clearAll: { en: 'ClearAll', jp: '全てクリア' },
    apply: { en: 'Apply', jp: '適用' },
    refineSearch: { en: 'Refine Search', jp: '詳細検索' },
    mins: { en: 'mins', jp: '分' },
    searchAnotherCity: { en: 'Search another city...', jp: '他の街を検索...' },
    findFlats: { en: 'Find flats in a city...', jp: '街で物件を検索...' },
    close: { en: 'Close', jp: '閉じる' },
    noFlats: { en: 'There are no flats with that criteria', jp: 'そのエリア・条件で物件はありませんでした。' },
    searchAnother: { en: 'Please search another', jp: '他の条件でお探し下さい。' },
    search: { en: 'Search', jp: '' },
    // show flat
    availableAmenities: { en: 'Available Amenities', jp: '物件の特徴・設備' },
    selectRange: { en: 'Select range of dates you want', jp: ' 日程を指定' },
    selectFirst: { en: 'Please select first day ', jp: 'チェックイン日を指定' },
    selectLast: { en: 'Please select last day ', jp: 'チェックアウト日を指定' },
    selectFrom: { en: 'Selected From', jp: '指定された日程' },
    noNearby: { en: 'No nearby places selected', jp: 'まだオーナーによって選択されてません。' },
    messages: { en: 'Messages', jp: 'メッセージ' },
    reviews: { en: 'Reviews', jp: 'レビュー' },
    requestReservation: { en: 'Request Reservation', jp: '予約をリクエストする' },
    blockDates: { en: 'Block Dates', jp: '日程をブロックする' },
    syncCalendar: { en: 'Sync Calendar', jp: 'カレンダーを同期' },
    // landing
    bannerMessage: { en: 'Live the way you want', jp: '住みかたを選ぼう' },
    // edit create flat
    createListing: { en: 'Create a Listing', jp: '物件を登録' },
    editYourListing: { en: 'Edit Your Listing', jp: '物件の編集' },
    editBasicInformation: { en: 'Edit Basic Information and Amenities', jp: '基本情報及び設備の編集' },
    streetAddress: { en: 'Street Address', jp: '町村番地' },
    city: { en: 'City', jp: '市区' },
    state: { en: 'State', jp: '都道府県' },
    zip: { en: 'Zip/Postal Code', jp: '郵便番号' },
    region: { en: 'Region', jp: '地域' },
    country: { en: 'Country', jp: '国' },
    area: { en: 'Area', jp: 'エリア' },
    description: { en: 'Description', jp: '物件の特徴' },
    salesPoint: { en: 'Sales Point', jp: 'セールスポイント' },
    pricePerMonth: { en: 'Price per Month', jp: '家賃 (月)' },
    floorSpace: { en: 'Floor Space m²', jp: '床面積 (m²)' },
    guests: { en: 'Guests', jp: '人数' },
    rooms: { en: 'Rooms', jp: '部屋数' },
    beds: { en: 'Beds', jp: 'ベッド数' },
    kingOrQueen: { en: 'King or Queen Beds', jp: 'キング・クイーンベッド' },
    flatType: { en: 'Property Type', jp: '物件タイプ' },
    bath: { en: 'Bath', jp: 'バス' },
    intro: { en: 'Intro', jp: '物件紹介' },
    nearestStation: { en: 'Nearest Station', jp: '最寄駅' },
    minutesToNearest: { en: 'Mins to Nearest Station', jp: '最寄り駅徒歩' },
    nearestStation2: { en: '2nd Nearest Station', jp: '次の最寄駅' },
    cancellation: { en: 'Cancellation', jp: 'キャンセル' },
    smoking: { en: 'Smoking', jp: '喫煙' },
    icalExplain: { en: 'To sync calendar for this flat, copy url of .ics file from Google Calendar or other listing apps and paste here', jp: 'この物件のカレンダーを同期するには、Googleカレンダーや他の賃貸アプリの.ics形式ファイルをコピーして、ここに貼り付けて下さい。' },
    icalImport: { en: 'iCalendar URL', jp: 'iCalendar URL' },
    confirmAbove: { en: 'Confirm above changes and submit', jp: '上記を確認して送信' },
    submit: { en: 'Submit', jp: '送信' },
    deleteImagesAdd: { en: 'Delete images to add', jp: '追加するには画像を削除して下さい。' },
    addEditLanguages: { en: 'Add or Edit Languages', jp: '言語を追加・編集' },
    baseLanguage: { en: 'Base Language', jp: 'ベースの言語' },
    availableLanguages: { en: 'Available Languages', jp: '追加済みの言語' },
    noOtherLanguages: { en: 'No other languages added.', jp: '他の言語は追加されてません。' },
    addAnotherLanguage: { en: 'Add Another Language', jp: '言語を追加する' },
    AddDeletePhotos: { en: 'Add or Delete Photos', jp: '画像を追加・削除  ' },
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
    lastName: { en: 'Last Name', jp: '性名' },
    birthday: { en: 'Birthday', jp: '生年月日' },
    address: { en: 'Address', jp: '住所' },
    selfIntro: { en: 'Self Intro', jp: '自己紹介' },
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
    enterMessage: { en: 'Enter you message here', jp: 'メッセージを入力' },
    filterKeyWords: { en: 'Filter by key words...', jp: 'キーワードで絞り込む...' },
    filterListing: { en: 'Filter by listing...', jp: '物件で絞り込む...' },
    allListings: { en: 'All listings', jp: '全ての物件' },
    messageDateOldest: { en: 'Message Date (oldest)', jp: '日付で並べる(昇順)' },
    messageDateNewest: { en: 'Message Date (newest)', jp: '日付で並べる(降順)' },
    orderBy: { en: 'Order by', jp: '並べを変える' },
    send: { en: 'Send', jp: '送信' },
    noConversation: { en: 'You have not started a conversation... \nStart one by sending a message! \nMake sure to introduce yourself',
      jp: 'まだコンバセーションを始めてません。\n  メッセージを送って始めましょう。\n　自己紹介を忘れない様に。' },
    // edit profile
    noConversationsYet: { en: 'You have no conversations.', jp: 'まだメッセージはありません。' },
    editProfile: { en: 'Edit Profile', jp: 'プロフィールの編集' },
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
  };

export default appLanguages;
