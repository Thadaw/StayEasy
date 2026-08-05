export interface City {
  name: string;
  image: string;
  description: string;
  attractions: string[];
  bestFor: string[];
}

export interface Country {
  code: string;
  flag: string;
  name: string;
  currency: string;
  symbol: string;
  currencyName: string;
  continent: string;
  capital: string;
  heroImage: string;
  description: string;
  cities: City[];
  topAttractions: string[];
  cuisine: string[];
  bestTime: string;
}

export const worldCountries: Country[] = [
  // ΓöÇΓöÇ ASIA ΓöÇΓöÇ
  {
    code: "IN", flag: "≡ƒç«≡ƒç│", name: "India", currency: "INR", symbol: "Γé╣", currencyName: "Indian Rupee", continent: "Asia",
    capital: "New Delhi", heroImage: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&h=600&fit=crop",
    description: "A land of ancient civilisations, Himalayan peaks, golden deserts, backwater lagoons and some of the world's most dazzling temples and palaces.",
    topAttractions: ["Taj Mahal", "Varanasi Ghats", "Jaipur Pink City", "Kerala Backwaters", "Ladakh Mountains", "Ajanta Caves"],
    cuisine: ["Biryani", "Butter Chicken", "Dosa", "Rogan Josh", "Pani Puri", "Gulab Jamun"],
    bestTime: "October ΓÇô March",
    cities: [
      { name: "Mumbai", image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&h=400&fit=crop", description: "India's financial capital and city of dreams, home to Bollywood and the Gateway of India.", attractions: ["Gateway of India", "Marine Drive", "Elephanta Caves", "Dharavi", "Juhu Beach"], bestFor: ["Nightlife", "Food", "Film"] },
      { name: "Delhi", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&h=400&fit=crop", description: "A city where Mughal grandeur meets modern India, with Red Fort, Humayun's Tomb and vibrant bazaars.", attractions: ["Red Fort", "Qutub Minar", "India Gate", "Chandni Chowk", "Humayun's Tomb"], bestFor: ["History", "Street Food", "Culture"] },
      { name: "Jaipur", image: "https://images.unsplash.com/photo-1477587458883-47145ed6979f?w=600&h=400&fit=crop", description: "The Pink City, gateway to Rajasthan's royal heritage with stunning forts and palaces.", attractions: ["Amber Fort", "Hawa Mahal", "City Palace", "Jantar Mantar", "Nahargarh Fort"], bestFor: ["Heritage", "Shopping", "Royalty"] },
      { name: "Goa", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&h=400&fit=crop", description: "India's party capital with pristine beaches, Portuguese architecture and vibrant nightlife.", attractions: ["Baga Beach", "Basilica of Bom Jesus", "Dudhsagar Falls", "Anjuna Market", "Fort Aguada"], bestFor: ["Beaches", "Nightlife", "Watersports"] },
      { name: "Varanasi", image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&h=400&fit=crop", description: "One of the world's oldest cities, a sacred Hindu pilgrimage site on the Ganges River.", attractions: ["Dashashwamedh Ghat", "Kashi Vishwanath Temple", "Sarnath", "Ganga Aarti", "Manikarnika Ghat"], bestFor: ["Spirituality", "Culture", "Photography"] },
      { name: "Agra", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&h=400&fit=crop", description: "Home to the immortal Taj Mahal, one of the Seven Wonders of the World.", attractions: ["Taj Mahal", "Agra Fort", "Fatehpur Sikri", "Itmad-ud-Daula", "Mehtab Bagh"], bestFor: ["Heritage", "Romance", "Mughal History"] },
      { name: "Kerala", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=400&fit=crop", description: "God's Own Country ΓÇö lush backwaters, spice plantations, Ayurvedic retreats and pristine beaches.", attractions: ["Alleppey Backwaters", "Munnar Tea Gardens", "Periyar Wildlife", "Kovalam Beach", "Fort Kochi"], bestFor: ["Wellness", "Nature", "Houseboat Stays"] },
      { name: "Ladakh", image: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=600&h=400&fit=crop", description: "The Land of High Passes ΓÇö dramatic Himalayan landscapes, ancient monasteries and star-filled skies.", attractions: ["Pangong Lake", "Thiksey Monastery", "Nubra Valley", "Khardung La", "Leh Palace"], bestFor: ["Adventure", "Trekking", "Monasteries"] },
      { name: "Udaipur", image: "https://images.unsplash.com/photo-1585494156145-1c60a4fe952b?w=600&h=400&fit=crop", description: "City of Lakes ΓÇö a romantic Rajput city of palaces reflected in shimmering lakes.", attractions: ["City Palace", "Lake Pichola", "Jag Mandir", "Saheliyon ki Bari", "Monsoon Palace"], bestFor: ["Romance", "Palaces", "Sunsets"] },
      { name: "Kolkata", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop", description: "The cultural capital of India, City of Joy with Victorian architecture and literary heritage.", attractions: ["Victoria Memorial", "Howrah Bridge", "Dakshineswar Temple", "Park Street", "Sundarbans"], bestFor: ["Culture", "Literature", "Food"] },
    ],
  },
  {
    code: "NP", flag: "≡ƒç│≡ƒç╡", name: "Nepal", currency: "NPR", symbol: "αñ░αÑé", currencyName: "Nepalese Rupee", continent: "Asia",
    capital: "Kathmandu", heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&h=600&fit=crop",
    description: "The roof of the world ΓÇö home to 8 of the 14 highest peaks including Everest, ancient stupas and vibrant Newari culture.",
    topAttractions: ["Mount Everest Base Camp", "Boudhanath Stupa", "Annapurna Circuit", "Chitwan National Park", "Pashupatinath Temple"],
    cuisine: ["Dal Bhat", "Momo", "Newari Feast", "Sel Roti", "Thukpa", "Yak Cheese"],
    bestTime: "March ΓÇô May & October ΓÇô November",
    cities: [
      { name: "Kathmandu", image: "https://images.unsplash.com/photo-1529094344530-42b4571ac6b8?w=600&h=400&fit=crop", description: "Nepal's capital in a valley ringed by mountains, filled with UNESCO World Heritage temples and trekking hubs.", attractions: ["Boudhanath Stupa", "Swayambhunath", "Pashupatinath Temple", "Durbar Square", "Garden of Dreams"], bestFor: ["Temples", "Trekking Gateway", "Culture"] },
      { name: "Pokhara", image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop", description: "Gateway to the Annapurna range with a serene lake and jaw-dropping mountain reflections.", attractions: ["Phewa Lake", "World Peace Pagoda", "Annapurna Base Camp Trek", "Devi's Falls", "Paragliding"], bestFor: ["Adventure", "Trekking", "Lakeside Dining"] },
      { name: "Chitwan", image: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=600&h=400&fit=crop", description: "UNESCO-listed national park famous for one-horned rhinos, Bengal tigers and elephant safaris.", attractions: ["Elephant Safari", "Jungle Walk", "Rhino Spotting", "Canoe Ride", "Tharu Cultural Show"], bestFor: ["Wildlife", "Safari", "Nature"] },
      { name: "Lumbini", image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop", description: "Birthplace of Lord Buddha, a sacred pilgrimage site with ancient monasteries and the Mayadevi Temple.", attractions: ["Mayadevi Temple", "Ashoka Pillar", "Peace Flame", "Monasteries from 20 countries", "Sacred Garden"], bestFor: ["Spirituality", "Pilgrimage", "History"] },
      { name: "Bhaktapur", image: "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=600&h=400&fit=crop", description: "Remarkably preserved medieval Newari city with stunning 15th-century Durbar Square.", attractions: ["Durbar Square", "55-Window Palace", "Nyatapola Temple", "Pottery Square", "Peacock Window"], bestFor: ["Heritage", "Photography", "Crafts"] },
      { name: "Namche Bazaar", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop", description: "The gateway to Everest ΓÇö a Sherpa trading hub perched at 3,440m with panoramic Himalayan views.", attractions: ["Everest View Hotel", "Sherpa Culture Museum", "Hillary School", "Khumjung Village", "Thame Monastery"], bestFor: ["Trekking", "Sherpa Culture", "Everest Views"] },
      { name: "Nagarkot", image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop", description: "Hill station near Kathmandu famous for breathtaking Himalayan sunrise views over eight mountain ranges.", attractions: ["Himalayan Sunrise", "Nagarkot Fort", "Village Walks", "Bird Watching", "Changu Narayan Temple"], bestFor: ["Sunrises", "Relaxation", "Views"] },
    ],
  },
  {
    code: "JP", flag: "≡ƒç»≡ƒç╡", name: "Japan", currency: "JPY", symbol: "┬Ñ", currencyName: "Japanese Yen", continent: "Asia",
    capital: "Tokyo", heroImage: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=1200&h=600&fit=crop",
    description: "Where ancient tradition meets hyper-modern innovation ΓÇö cherry blossoms, samurai castles, ramen shops and bullet trains.",
    topAttractions: ["Mount Fuji", "Fushimi Inari Shrine", "Tokyo Skytree", "Hiroshima Peace Memorial", "Nara Deer Park"],
    cuisine: ["Sushi", "Ramen", "Tempura", "Takoyaki", "Wagyu Beef", "Matcha"],
    bestTime: "March ΓÇô May (Sakura) & October ΓÇô November",
    cities: [
      { name: "Tokyo", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop", description: "The world's most populous metropolis ΓÇö neon lights, anime culture, Michelin stars and serene shrines side by side.", attractions: ["Shibuya Crossing", "Senso-ji Temple", "Tokyo Skytree", "Shinjuku", "Tsukiji Market"], bestFor: ["Technology", "Food", "Nightlife"] },
      { name: "Kyoto", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop", description: "Japan's ancient imperial capital with over 1,600 Buddhist temples and traditional geisha districts.", attractions: ["Fushimi Inari", "Arashiyama Bamboo", "Kinkaku-ji", "Gion District", "Philosopher's Path"], bestFor: ["Temples", "Geisha Culture", "Zen Gardens"] },
      { name: "Osaka", image: "https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?w=600&h=400&fit=crop", description: "Japan's culinary capital and city of fun ΓÇö street food, comedy and Osaka Castle.", attractions: ["Osaka Castle", "Dotonbori", "Namba", "Universal Studios", "Kuromon Market"], bestFor: ["Food", "Entertainment", "Shopping"] },
      { name: "Hiroshima", image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&h=400&fit=crop", description: "A city that rose from tragedy to become a symbol of peace and resilience.", attractions: ["Peace Memorial Park", "A-Bomb Dome", "Itsukushima Shrine", "Miyajima Island", "Hiroshima Castle"], bestFor: ["History", "Peace Tourism", "Island Hopping"] },
      { name: "Nara", image: "https://images.unsplash.com/photo-1571619888-b2b87c2a4539?w=600&h=400&fit=crop", description: "Japan's first capital, where friendly deer roam freely among ancient temples and pagodas.", attractions: ["Todai-ji Temple", "Nara Park Deer", "Kasuga Taisha", "Isuien Garden", "Naramachi"], bestFor: ["Wildlife", "Temples", "Day Trips"] },
      { name: "Sapporo", image: "https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=600&h=400&fit=crop", description: "Hokkaido's capital ΓÇö world-famous snow festival, craft beer and skiing resorts.", attractions: ["Snow Festival", "Odori Park", "Clock Tower", "Niseko Ski Resort", "Hokkaido Shrine"], bestFor: ["Skiing", "Beer", "Winter Sports"] },
    ],
  },
  {
    code: "CN", flag: "≡ƒç¿≡ƒç│", name: "China", currency: "CNY", symbol: "┬Ñ", currencyName: "Chinese Yuan", continent: "Asia",
    capital: "Beijing", heroImage: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1200&h=600&fit=crop",
    description: "The world's oldest continuous civilisation ΓÇö Great Wall, terracotta warriors, karst mountains and futuristic megacities.",
    topAttractions: ["Great Wall of China", "Forbidden City", "Terracotta Army", "Li River Karst", "West Lake Hangzhou"],
    cuisine: ["Peking Duck", "Dim Sum", "Hot Pot", "Kung Pao Chicken", "Xiaolongbao", "Mapo Tofu"],
    bestTime: "April ΓÇô May & September ΓÇô October",
    cities: [
      { name: "Beijing", image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&h=400&fit=crop", description: "China's imperial capital, home to the Forbidden City, Tiananmen Square and the Great Wall.", attractions: ["Great Wall", "Forbidden City", "Summer Palace", "Temple of Heaven", "Hutong Alleys"], bestFor: ["History", "Imperial Heritage", "Culture"] },
      { name: "Shanghai", image: "https://images.unsplash.com/photo-1538428494232-7278d7e5caeb?w=600&h=400&fit=crop", description: "China's dazzling financial hub where Art Deco Bund meets Pudong's futuristic skyline.", attractions: ["The Bund", "Yu Garden", "Shanghai Tower", "French Concession", "Yuyuan Bazaar"], bestFor: ["Finance", "Architecture", "Shopping"] },
      { name: "Xi'an", image: "https://images.unsplash.com/photo-1584535793573-857e7d5ceaed?w=600&h=400&fit=crop", description: "Ancient capital of 13 dynasties, home to the legendary Terracotta Army.", attractions: ["Terracotta Army", "City Wall", "Muslim Quarter", "Giant Wild Goose Pagoda", "Huaqing Hot Springs"], bestFor: ["Ancient History", "Food", "Cycling the Wall"] },
      { name: "Guilin", image: "https://images.unsplash.com/photo-1537531383496-f4655f080975?w=600&h=400&fit=crop", description: "Famous for its dramatic karst limestone peaks and the scenic Li River cruise.", attractions: ["Li River Cruise", "Reed Flute Cave", "Longsheng Rice Terraces", "Elephant Trunk Hill", "Yangshuo"], bestFor: ["Nature", "Scenery", "River Cruises"] },
      { name: "Chengdu", image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&h=400&fit=crop", description: "Home of the giant panda and the birthplace of hotpot ΓÇö a laid-back Sichuan city full of teahouses.", attractions: ["Giant Panda Base", "Jiuzhaigou Valley", "Leshan Giant Buddha", "Jinli Ancient Street", "Wuhou Shrine"], bestFor: ["Pandas", "Food", "Nature"] },
    ],
  },
  {
    code: "TH", flag: "≡ƒç╣≡ƒç¡", name: "Thailand", currency: "THB", symbol: "α╕┐", currencyName: "Thai Baht", continent: "Asia",
    capital: "Bangkok", heroImage: "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=1200&h=600&fit=crop",
    description: "The Land of Smiles ΓÇö dazzling temples, tropical islands, elephant sanctuaries and world-class street food.",
    topAttractions: ["Grand Palace Bangkok", "Phi Phi Islands", "Chiang Mai Night Bazaar", "Ayutthaya Temples", "Elephant Nature Park"],
    cuisine: ["Pad Thai", "Som Tum", "Tom Yum", "Massaman Curry", "Mango Sticky Rice", "Khao Man Gai"],
    bestTime: "November ΓÇô February",
    cities: [
      { name: "Bangkok", image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&h=400&fit=crop", description: "Southeast Asia's most vibrant capital ΓÇö temples, markets, rooftop bars and incredible street food.", attractions: ["Grand Palace", "Wat Pho", "Chatuchak Market", "Khao San Road", "Floating Markets"], bestFor: ["Temples", "Street Food", "Nightlife"] },
      { name: "Phuket", image: "https://images.unsplash.com/photo-1504214208698-ea446ecda9d8?w=600&h=400&fit=crop", description: "Thailand's largest island with stunning beaches, clear water and vibrant beach resort scene.", attractions: ["Patong Beach", "Big Buddha", "Phi Phi Islands Day Trip", "Old Town", "Phang Nga Bay"], bestFor: ["Beaches", "Island Hopping", "Diving"] },
      { name: "Chiang Mai", image: "https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=600&h=400&fit=crop", description: "Northern Thailand's cultural heart ΓÇö ancient temples, hill tribes, elephant sanctuaries and Sunday markets.", attractions: ["Elephant Nature Park", "Doi Suthep Temple", "Night Bazaar", "Cooking Classes", "Doi Inthanon"], bestFor: ["Culture", "Elephants", "Trekking"] },
      { name: "Krabi", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop", description: "Dramatic limestone cliffs plunging into emerald waters with some of Southeast Asia's best rock climbing.", attractions: ["Railay Beach", "Four Islands Tour", "Tiger Cave Temple", "Krabi Town", "Kayaking"], bestFor: ["Rock Climbing", "Beaches", "Snorkelling"] },
      { name: "Koh Samui", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop", description: "Gulf of Thailand paradise island with luxury resorts, palm-fringed beaches and Full Moon parties.", attractions: ["Chaweng Beach", "Big Buddha Temple", "Ang Thong Marine Park", "Samui Aquarium", "Fisherman's Village"], bestFor: ["Luxury Resorts", "Beaches", "Wellness"] },
    ],
  },
  {
    code: "ID", flag: "≡ƒç«≡ƒç⌐", name: "Indonesia", currency: "IDR", symbol: "Rp", currencyName: "Indonesian Rupiah", continent: "Asia",
    capital: "Jakarta", heroImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&h=600&fit=crop",
    description: "The world's largest archipelago ΓÇö 17,000 islands spanning Bali's rice terraces, Komodo's dragons and Papua's rainforests.",
    topAttractions: ["Bali Temples", "Komodo Dragon Island", "Borobudur", "Mount Bromo", "Raja Ampat"],
    cuisine: ["Nasi Goreng", "Rendang", "Satay", "Gado-Gado", "Soto Ayam", "Martabak"],
    bestTime: "April ΓÇô October",
    cities: [
      { name: "Bali", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop", description: "The Island of the Gods ΓÇö terraced rice paddies, volcanic peaks, world-class surf and ancient Hindu temples.", attractions: ["Tanah Lot", "Ubud Monkey Forest", "Tegallalang Rice Terraces", "Seminyak Beach", "Mount Agung"], bestFor: ["Spirituality", "Surfing", "Yoga Retreats"] },
      { name: "Yogyakarta", image: "https://images.unsplash.com/photo-1584097764584-e0cc7c6f2ce4?w=600&h=400&fit=crop", description: "Cultural heart of Java with Borobudur, Prambanan and the Sultan's Kraton palace.", attractions: ["Borobudur Temple", "Prambanan", "Kraton Palace", "Mount Merapi", "Malioboro Street"], bestFor: ["Temples", "Culture", "Batik Art"] },
      { name: "Lombok", image: "https://images.unsplash.com/photo-1559628233-100c798642d5?w=600&h=400&fit=crop", description: "Bali's quieter neighbour with pristine beaches, epic surf and the sacred Rinjani volcano.", attractions: ["Mount Rinjani", "Gili Islands", "Senggigi Beach", "Sasak Villages", "Pink Beach"], bestFor: ["Trekking", "Island Hopping", "Surfing"] },
      { name: "Raja Ampat", image: "https://images.unsplash.com/photo-1540202403-b7abd6747a18?w=600&h=400&fit=crop", description: "Papua's remote archipelago with the richest marine biodiversity on Earth ΓÇö a diver's ultimate paradise.", attractions: ["Wayag Island", "Pianemo Viewpoint", "Diving", "Snorkelling", "Mangrove Kayaking"], bestFor: ["Diving", "Snorkelling", "Marine Life"] },
      { name: "Komodo", image: "https://images.unsplash.com/photo-1543169108-32ac15a21e05?w=600&h=400&fit=crop", description: "Home of the world's largest lizard in a dramatic island national park of savannah, reefs and pink beaches.", attractions: ["Komodo Dragon Trekking", "Pink Beach", "Diving", "Padar Island Viewpoint", "Snorkelling"], bestFor: ["Wildlife", "Adventure", "Unique Experiences"] },
    ],
  },
  {
    code: "VN", flag: "≡ƒç╗≡ƒç│", name: "Vietnam", currency: "VND", symbol: "Γé½", currencyName: "Vietnamese Dong", continent: "Asia",
    capital: "Hanoi", heroImage: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&h=600&fit=crop",
    description: "A slender S-shaped country of extraordinary diversity ΓÇö limestone karst bays, ancient towns, imperial citadels and world-class cuisine.",
    topAttractions: ["Ha Long Bay", "Hß╗Öi An Ancient Town", "Mß╗╣ S╞ín Sanctuary", "Phong Nha Caves", "Sapa Rice Terraces"],
    cuisine: ["Phß╗ƒ", "B├ính M├¼", "B├║n Chß║ú", "B├ính X├¿o", "Cao Lß║ºu", "Gß╗Åi Cuß╗æn"],
    bestTime: "February ΓÇô April",
    cities: [
      { name: "Hanoi", image: "https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?w=600&h=400&fit=crop", description: "Vietnam's capital ΓÇö a city of tree-lined boulevards, ancient temples, a gorgeous lake and legendary street food.", attractions: ["Hoan Kiem Lake", "Temple of Literature", "Ho Chi Minh Mausoleum", "Old Quarter", "Water Puppet Theatre"], bestFor: ["History", "Street Food", "Culture"] },
      { name: "Ho Chi Minh City", image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&h=400&fit=crop", description: "Vietnam's economic powerhouse ΓÇö buzzing with motorbikes, war history, rooftop bars and excellent coffee.", attractions: ["War Remnants Museum", "Cu Chi Tunnels", "Ben Thanh Market", "Reunification Palace", "Bui Vien Walking Street"], bestFor: ["History", "Nightlife", "Food"] },
      { name: "Hß╗Öi An", image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&h=400&fit=crop", description: "A UNESCO-listed ancient trading port, glowing with lanterns and rich in Japanese, Chinese and French heritage.", attractions: ["Ancient Town Lantern Streets", "Japanese Covered Bridge", "My Son Sanctuary", "Cham Island Diving", "Tailors & Silk Shops"], bestFor: ["Heritage", "Lanterns", "Tailoring"] },
      { name: "Ha Long Bay", image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&h=400&fit=crop", description: "3,000 limestone karst islands rising from emerald waters ΓÇö one of the world's most iconic seascapes.", attractions: ["Junk Boat Cruise", "Kayaking", "Sung Sot Cave", "Ti Top Island", "Fishing Villages"], bestFor: ["Cruises", "Kayaking", "Photography"] },
      { name: "Sapa", image: "https://images.unsplash.com/photo-1522010969015-52bc967c5ed2?w=600&h=400&fit=crop", description: "A misty hill town in the Ho├áng Li├¬n S╞ín mountains, home to colourful hill tribes and stunning rice terraces.", attractions: ["Fansipan Summit", "Muong Hoa Valley Terraces", "Ethnic Minority Markets", "Cat Cat Village", "Trekking"], bestFor: ["Trekking", "Ethnic Culture", "Photography"] },
    ],
  },
  {
    code: "SG", flag: "≡ƒç╕≡ƒç¼", name: "Singapore", currency: "SGD", symbol: "S$", currencyName: "Singapore Dollar", continent: "Asia",
    capital: "Singapore", heroImage: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&h=600&fit=crop",
    description: "The Lion City ΓÇö an immaculate garden city where rainforest meets skyscrapers, Michelin hawker stalls and infinity pools.",
    topAttractions: ["Gardens by the Bay", "Marina Bay Sands", "Sentosa Island", "Orchard Road", "Hawker Centres"],
    cuisine: ["Chilli Crab", "Hainanese Chicken Rice", "Laksa", "Char Kway Teow", "Satay", "Kaya Toast"],
    bestTime: "February ΓÇô April",
    cities: [
      { name: "Marina Bay", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&h=400&fit=crop", description: "The stunning waterfront district with the iconic Marina Bay Sands and the futuristic Gardens by the Bay.", attractions: ["Marina Bay Sands SkyPark", "Gardens by the Bay", "ArtScience Museum", "Spectra Light Show", "Merlion Park"], bestFor: ["Architecture", "Views", "Luxury"] },
      { name: "Sentosa", image: "https://images.unsplash.com/photo-1549284634-a5d7ad1d2c0c?w=600&h=400&fit=crop", description: "Singapore's resort island with Universal Studios, beaches, cable car and a casino.", attractions: ["Universal Studios", "Palawan Beach", "Adventure Cove", "Skyline Luge", "S.E.A. Aquarium"], bestFor: ["Theme Parks", "Beaches", "Family Fun"] },
      { name: "Chinatown", image: "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=600&h=400&fit=crop", description: "A colourful district of clan associations, Buddha Tooth Relic Temple and incredible hawker food.", attractions: ["Buddha Tooth Relic Temple", "Hawker Centre", "Sri Mariamman Temple", "Smith Street", "Heritage Centre"], bestFor: ["Culture", "Food", "Heritage"] },
      { name: "Little India", image: "https://images.unsplash.com/photo-1609861671697-22659501c5ae?w=600&h=400&fit=crop", description: "A vibrant enclave of flower garlands, sari shops, spice merchants and colourful Hindu temples.", attractions: ["Sri Veeramakaliamman Temple", "Mustafa Centre", "Tekka Market", "Serangoon Road", "Heritage Centre"], bestFor: ["Culture", "Shopping", "Spices"] },
    ],
  },
  {
    code: "AE", flag: "≡ƒçª≡ƒç¬", name: "United Arab Emirates", currency: "AED", symbol: "╪».╪Ñ", currencyName: "UAE Dirham", continent: "Asia",
    capital: "Abu Dhabi", heroImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&h=600&fit=crop",
    description: "Where desert meets futurism ΓÇö the world's tallest tower, indoor ski slopes, camel racing and lavish island resorts.",
    topAttractions: ["Burj Khalifa", "Sheikh Zayed Grand Mosque", "Palm Jumeirah", "Dubai Mall", "Desert Safari"],
    cuisine: ["Shawarma", "Camel Milk Ice Cream", "Luqaimat", "Majboos", "Harees", "Esh Asaraya"],
    bestTime: "November ΓÇô March",
    cities: [
      { name: "Dubai", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop", description: "The city of superlatives ΓÇö world's tallest building, largest mall, indoor ski slope and an underwater hotel.", attractions: ["Burj Khalifa", "Dubai Mall", "Palm Jumeirah", "Dubai Frame", "Desert Safari"], bestFor: ["Luxury", "Shopping", "Architecture"] },
      { name: "Abu Dhabi", image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&h=400&fit=crop", description: "The UAE's capital ΓÇö magnificent Sheikh Zayed Mosque, Formula 1 track and Louvre Abu Dhabi.", attractions: ["Sheikh Zayed Grand Mosque", "Louvre Abu Dhabi", "Yas Island", "Ferrari World", "Mangrove National Park"], bestFor: ["Culture", "Motorsport", "Architecture"] },
      { name: "Sharjah", image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&h=400&fit=crop", description: "UAE's cultural capital, UNESCO Creative City of Design with excellent museums and traditional souks.", attractions: ["Sharjah Art Museum", "Heritage Area", "Al Noor Island", "Blue Souk", "Sharjah Aquarium"], bestFor: ["Art", "Culture", "Museums"] },
    ],
  },
  // ΓöÇΓöÇ EUROPE ΓöÇΓöÇ
  {
    code: "FR", flag: "≡ƒç½≡ƒç╖", name: "France", currency: "EUR", symbol: "Γé¼", currencyName: "Euro", continent: "Europe",
    capital: "Paris", heroImage: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1200&h=600&fit=crop",
    description: "Art, gastronomy, fashion and romance ΓÇö the Eiffel Tower, Bordeaux vineyards, the C├┤te d'Azur and the Alps.",
    topAttractions: ["Eiffel Tower", "Louvre Museum", "Palace of Versailles", "Mont Saint-Michel", "French Riviera"],
    cuisine: ["Croissant", "Coq au Vin", "Bouillabaisse", "Cr├¿me Br├╗l├⌐e", "Ratatouille", "Macarons"],
    bestTime: "June ΓÇô August & September",
    cities: [
      { name: "Paris", image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&h=400&fit=crop", description: "The City of Light ΓÇö Eiffel Tower, the Louvre, caf├⌐ culture and haute couture on every corner.", attractions: ["Eiffel Tower", "Louvre", "Mus├⌐e d'Orsay", "Champs-├ëlys├⌐es", "Montmartre"], bestFor: ["Romance", "Art", "Food"] },
      { name: "Nice", image: "https://images.unsplash.com/photo-1533087474565-fb7cbdb096b7?w=600&h=400&fit=crop", description: "Queen of the French Riviera ΓÇö the famous Promenade des Anglais, pastel-coloured buildings and azure Mediterranean.", attractions: ["Promenade des Anglais", "Old Town", "Castle Hill", "Marc Chagall Museum", "Monaco Day Trip"], bestFor: ["Beaches", "Art", "Mediterranean Life"] },
      { name: "Lyon", image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&h=400&fit=crop", description: "France's culinary capital and UNESCO-listed city of bouchons, silk and Roman amphitheatres.", attractions: ["Vieux Lyon", "Fourvi├¿re Basilica", "Bouchon Restaurants", "F├¬te des Lumi├¿res", "Confluence Museum"], bestFor: ["Gastronomy", "History", "Culture"] },
      { name: "Bordeaux", image: "https://images.unsplash.com/photo-1540804654772-f81f20df8c20?w=600&h=400&fit=crop", description: "Wine capital of the world ΓÇö elegant 18th-century architecture, Michelin stars and endless vineyards.", attractions: ["Cit├⌐ du Vin", "Place de la Bourse", "Saint-├ëmilion", "M├⌐doc Wineries", "Miroir d'eau"], bestFor: ["Wine", "Architecture", "Cycling"] },
      { name: "Provence", image: "https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=600&h=400&fit=crop", description: "Lavender fields, hilltop villages, Roman aqueducts and ros├⌐ wine under the golden Mediterranean sun.", attractions: ["Lavender Fields Valensole", "Gorges du Verdon", "Les Baux-de-Provence", "Pont du Gard", "Aix-en-Provence"], bestFor: ["Countryside", "Lavender", "Slow Travel"] },
    ],
  },
  {
    code: "IT", flag: "≡ƒç«≡ƒç╣", name: "Italy", currency: "EUR", symbol: "Γé¼", currencyName: "Euro", continent: "Europe",
    capital: "Rome", heroImage: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&h=600&fit=crop",
    description: "Ancient Rome, Renaissance art, Venetian canals, Amalfi coastline, Tuscan vineyards and the world's greatest cuisine.",
    topAttractions: ["Colosseum", "Venice Canals", "Cinque Terre", "Florence Duomo", "Amalfi Coast"],
    cuisine: ["Pizza Napoletana", "Pasta Carbonara", "Risotto", "Gelato", "Tiramisu", "Osso Buco"],
    bestTime: "April ΓÇô June & September ΓÇô October",
    cities: [
      { name: "Rome", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&h=400&fit=crop", description: "The Eternal City ΓÇö Colosseum, Vatican, Trevi Fountain and 2,000 years of history in every cobblestone.", attractions: ["Colosseum", "Vatican Museums", "Trevi Fountain", "Pantheon", "Borghese Gallery"], bestFor: ["History", "Art", "Food"] },
      { name: "Venice", image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600&h=400&fit=crop", description: "The floating city ΓÇö 118 islands connected by gondola routes, with the grandeur of St Mark's Basilica.", attractions: ["Grand Canal Gondola", "St Mark's Basilica", "Doge's Palace", "Murano Island", "Rialto Bridge"], bestFor: ["Romance", "Architecture", "Art"] },
      { name: "Florence", image: "https://images.unsplash.com/photo-1541370976299-4d24be5d982f?w=600&h=400&fit=crop", description: "Birthplace of the Renaissance ΓÇö Michelangelo's David, the Uffizi Gallery and the glorious Duomo.", attractions: ["Uffizi Gallery", "Michelangelo's David", "Duomo", "Ponte Vecchio", "Piazzale Michelangelo"], bestFor: ["Art", "Renaissance Heritage", "Food"] },
      { name: "Amalfi", image: "https://images.unsplash.com/photo-1533588416-5bd5bb1e46a0?w=600&h=400&fit=crop", description: "The breathtaking clifftop coastline ΓÇö colourful fishing villages perched above turquoise Mediterranean waters.", attractions: ["Positano", "Ravello Gardens", "Path of the Gods", "Amalfi Cathedral", "Blue Grotto Capri"], bestFor: ["Coastal Scenery", "Hiking", "Luxury"] },
      { name: "Cinque Terre", image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&h=400&fit=crop", description: "Five pastel fishing villages clinging to the Ligurian cliffs ΓÇö a UNESCO World Heritage coastal gem.", attractions: ["Sentiero Azzurro Trail", "Manarola", "Vernazza", "Swimming Coves", "Pesto Making"], bestFor: ["Hiking", "Photography", "Swimming"] },
    ],
  },
  {
    code: "ES", flag: "≡ƒç¬≡ƒç╕", name: "Spain", currency: "EUR", symbol: "Γé¼", currencyName: "Euro", continent: "Europe",
    capital: "Madrid", heroImage: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1200&h=600&fit=crop",
    description: "Flamenco passion, Sagrada Familia, siesta culture, tapas bars, golden beaches and the world's finest football.",
    topAttractions: ["Sagrada Familia", "Alhambra Granada", "Park G├╝ell", "Prado Museum", "Camino de Santiago"],
    cuisine: ["Paella", "Tapas", "Gazpacho", "Patatas Bravas", "Jam├│n Ib├⌐rico", "Churros"],
    bestTime: "March ΓÇô June & September ΓÇô November",
    cities: [
      { name: "Barcelona", image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&h=400&fit=crop", description: "Gaud├¡'s city of extraordinary architecture ΓÇö Sagrada Fam├¡lia, Park G├╝ell, and the buzzing La Barceloneta beach.", attractions: ["Sagrada Familia", "Park G├╝ell", "Las Ramblas", "Gothic Quarter", "Camp Nou"], bestFor: ["Architecture", "Beaches", "Nightlife"] },
      { name: "Madrid", image: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=600&h=400&fit=crop", description: "Spain's passionate capital ΓÇö the Prado, Reina Sof├¡a, Retiro Park and legendary tapas bars.", attractions: ["Prado Museum", "Retiro Park", "Plaza Mayor", "Reina Sofia", "El Rastro Market"], bestFor: ["Art", "Food", "Nightlife"] },
      { name: "Seville", image: "https://images.unsplash.com/photo-1508504509543-5ca0f2d0e255?w=600&h=400&fit=crop", description: "Birthplace of flamenco ΓÇö Alc├ízar palace, the golden Giralda tower and the scent of orange blossoms.", attractions: ["Alc├ízar", "Seville Cathedral & Giralda", "Barrio Santa Cruz", "Plaza de Espa├▒a", "Flamenco Shows"], bestFor: ["Flamenco", "Architecture", "Culture"] },
      { name: "Granada", image: "https://images.unsplash.com/photo-1569974498991-d3e5b9e9d62e?w=600&h=400&fit=crop", description: "The last Moorish kingdom ΓÇö the breathtaking Alhambra palace looming above a vibrant tapas culture.", attractions: ["Alhambra Palace", "Generalife Gardens", "Albaic├¡n Quarter", "Free Tapas Bars", "Sierra Nevada Skiing"], bestFor: ["Moorish Heritage", "Tapas", "Skiing"] },
      { name: "Ibiza", image: "https://images.unsplash.com/photo-1555990793-da11153b2473?w=600&h=400&fit=crop", description: "The White Isle ΓÇö Europe's nightlife capital but also a haven of secluded coves and hippie markets.", attractions: ["Pacha & Amnesia Clubs", "Dalt Vila Old Town", "Cala Comte Beach", "Hippy Market", "Es Vedr├á Rock"], bestFor: ["Nightlife", "Beaches", "Sunsets"] },
    ],
  },
  {
    code: "GB", flag: "≡ƒç¼≡ƒçº", name: "United Kingdom", currency: "GBP", symbol: "┬ú", currencyName: "British Pound", continent: "Europe",
    capital: "London", heroImage: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&h=600&fit=crop",
    description: "Westminster's democracy, Scottish Highlands, Welsh castles, Lake District poetry and an obsession with queuing and tea.",
    topAttractions: ["Big Ben & Houses of Parliament", "Edinburgh Castle", "Stonehenge", "Lake District", "Tower of London"],
    cuisine: ["Fish & Chips", "Full English Breakfast", "Afternoon Tea", "Haggis", "Welsh Rarebit", "Cornish Pasty"],
    bestTime: "May ΓÇô September",
    cities: [
      { name: "London", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&h=400&fit=crop", description: "One of the world's greatest cities ΓÇö Tower Bridge, the British Museum, West End theatre and Notting Hill.", attractions: ["Tower of London", "British Museum", "Buckingham Palace", "Hyde Park", "Borough Market"], bestFor: ["History", "Theatre", "Multiculture"] },
      { name: "Edinburgh", image: "https://images.unsplash.com/photo-1506377585622-bedcbb027afc?w=600&h=400&fit=crop", description: "Scotland's dramatic capital on a volcanic rock ΓÇö Gothic spires, whisky distilleries and the Royal Mile.", attractions: ["Edinburgh Castle", "Royal Mile", "Arthur's Seat", "Scotch Whisky Experience", "Holyrood Palace"], bestFor: ["History", "Whisky", "Festivals"] },
      { name: "Bath", image: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&h=400&fit=crop", description: "Georgian spa city built on Roman hot springs ΓÇö the perfect base for the Cotswolds and Stonehenge.", attractions: ["Roman Baths", "Bath Abbey", "Royal Crescent", "Thermae Bath Spa", "Lacock Village"], bestFor: ["History", "Spas", "Architecture"] },
      { name: "Oxford", image: "https://images.unsplash.com/photo-1580834341580-8c17a3a630ca?w=600&h=400&fit=crop", description: "The City of Dreaming Spires ΓÇö university colleges, the Bodleian Library and Harry Potter filming locations.", attractions: ["Christ Church College", "Bodleian Library", "Ashmolean Museum", "Punting on the Cherwell", "Blenheim Palace"], bestFor: ["Academia", "Architecture", "History"] },
      { name: "Lake District", image: "https://images.unsplash.com/photo-1524851628537-bbd5d57a8d64?w=600&h=400&fit=crop", description: "England's largest national park ΓÇö Wordsworth's landscape of fells, stone walls and shimmering lakes.", attractions: ["Windermere Lake Cruise", "Scafell Pike", "Beatrix Potter Museum", "Grasmere Gingerbread", "Ambleside Walks"], bestFor: ["Hiking", "Scenery", "Literary Heritage"] },
    ],
  },
  {
    code: "DE", flag: "≡ƒç⌐≡ƒç¬", name: "Germany", currency: "EUR", symbol: "Γé¼", currencyName: "Euro", continent: "Europe",
    capital: "Berlin", heroImage: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&h=600&fit=crop",
    description: "Bavarian castles, the Berlin Wall, Oktoberfest, the Black Forest, Rhine valley vineyards and superb engineering.",
    topAttractions: ["Neuschwanstein Castle", "Brandenburg Gate", "Cologne Cathedral", "Romantic Road", "Black Forest"],
    cuisine: ["Bratwurst", "Pretzels", "Sauerkraut", "Schnitzel", "Black Forest Cake", "Weissbier"],
    bestTime: "May ΓÇô September",
    cities: [
      { name: "Berlin", image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=600&h=400&fit=crop", description: "The coolest city in Europe ΓÇö reunification history, world-class clubs, street art and a booming food scene.", attractions: ["Brandenburg Gate", "East Side Gallery", "Reichstag", "Museum Island", "Tempelhof Field"], bestFor: ["Nightlife", "History", "Art"] },
      { name: "Munich", image: "https://images.unsplash.com/photo-1595867818082-083862f3d630?w=600&h=400&fit=crop", description: "Bavaria's elegant capital ΓÇö Oktoberfest, the Hofbr├ñuhaus, and a gateway to the Alps and fairy-tale castles.", attractions: ["Marienplatz", "English Garden", "Nymphenburg Palace", "BMW Museum", "Oktoberfest"], bestFor: ["Beer", "Culture", "Mountains"] },
      { name: "Hamburg", image: "https://images.unsplash.com/photo-1548688882-fe16f60e4fa2?w=600&h=400&fit=crop", description: "Germany's port city ΓÇö the Speicherstadt warehouse district, fish market and legendary Reeperbahn nightlife.", attractions: ["Speicherstadt", "Miniatur Wunderland", "Fish Market", "Elbphilharmonie", "Reeperbahn"], bestFor: ["Maritime Heritage", "Music", "Nightlife"] },
      { name: "Heidelberg", image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&h=400&fit=crop", description: "Germany's most romantic city ΓÇö a ruined castle above the Neckar river and Germany's oldest university.", attractions: ["Heidelberg Castle", "Old Town", "Philosophers' Walk", "Heidelberg University", "Karl-Theodor Bridge"], bestFor: ["Romance", "History", "Views"] },
    ],
  },
  {
    code: "GR", flag: "≡ƒç¼≡ƒç╖", name: "Greece", currency: "EUR", symbol: "Γé¼", currencyName: "Euro", continent: "Europe",
    capital: "Athens", heroImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&h=600&fit=crop",
    description: "Birthplace of democracy ΓÇö ancient Athens, Santorini's blue domes, Mykonos parties and Cretan olive groves.",
    topAttractions: ["Acropolis Athens", "Santorini Caldera", "Delphi", "Olympia", "Palace of Knossos"],
    cuisine: ["Moussaka", "Souvlaki", "Greek Salad", "Spanakopita", "Baklava", "Loukoumades"],
    bestTime: "May ΓÇô June & September ΓÇô October",
    cities: [
      { name: "Athens", image: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&h=400&fit=crop", description: "The cradle of Western civilisation ΓÇö the Acropolis, Parthenon and a buzzing Psiri neighbourhood.", attractions: ["Acropolis & Parthenon", "National Archaeological Museum", "Plaka", "Monastiraki Flea Market", "Cape Sounion"], bestFor: ["History", "Philosophy", "Food"] },
      { name: "Santorini", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&h=400&fit=crop", description: "The iconic caldera island ΓÇö white-washed cubes, blue-domed churches and the world's most celebrated sunsets.", attractions: ["Oia Sunset", "Caldera Boat Tour", "Black Sand Beach", "Akrotiri Ruins", "Wine Tasting"], bestFor: ["Sunsets", "Romance", "Wine"] },
      { name: "Mykonos", image: "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=600&h=400&fit=crop", description: "The party island of the Aegean ΓÇö windmills, Little Venice and legendary beach clubs.", attractions: ["Little Venice", "Windmills", "Paradise Beach", "Delos Island", "Chora Old Town"], bestFor: ["Nightlife", "Beaches", "Partying"] },
      { name: "Crete", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=400&fit=crop", description: "Greece's largest island ΓÇö Minoan ruins, the Samaria Gorge, crystal coves and excellent local cuisine.", attractions: ["Palace of Knossos", "Samaria Gorge", "Elafonisi Beach", "Heraklion Museum", "Chania Old Town"], bestFor: ["History", "Hiking", "Beaches"] },
    ],
  },
  {
    code: "PT", flag: "≡ƒç╡≡ƒç╣", name: "Portugal", currency: "EUR", symbol: "Γé¼", currencyName: "Euro", continent: "Europe",
    capital: "Lisbon", heroImage: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&h=600&fit=crop",
    description: "Fado music, age-of-discovery history, Atlantic surf, Porto's wine cellars and the golden light of the Algarve.",
    topAttractions: ["Bel├⌐m Tower", "Sintra Palaces", "Douro Valley", "Algarve Cliffs", "Jer├│nimos Monastery"],
    cuisine: ["Past├⌐is de Nata", "Bacalhau", "Francesinha", "Caldo Verde", "Piri Piri Chicken", "Port Wine"],
    bestTime: "March ΓÇô June & September ΓÇô October",
    cities: [
      { name: "Lisbon", image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&h=400&fit=crop", description: "Europe's most charming capital ΓÇö trams, fado music, past├⌐is de nata and hilltop miradouros.", attractions: ["Bel├⌐m Tower", "Jer├│nimos Monastery", "Alfama", "Time Out Market", "Sintra Day Trip"], bestFor: ["Culture", "Food", "Fado Music"] },
      { name: "Porto", image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&h=400&fit=crop", description: "A city of medieval bridges, port wine cellars, azulejo tiles and one of Europe's coolest bookshops.", attractions: ["Livraria Lello Bookshop", "Dom Lu├¡s Bridge", "Port Wine Caves Vila Nova", "Cl├⌐rigos Tower", "Bolh├úo Market"], bestFor: ["Wine", "Architecture", "Food"] },
      { name: "Algarve", image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&h=400&fit=crop", description: "Portugal's sun-drenched south ΓÇö dramatic sea stacks, sea caves, golden cliffs and world-class golf resorts.", attractions: ["Ponta da Piedade", "Benagil Cave", "Lagos Old Town", "Cape St. Vincent", "Silves Castle"], bestFor: ["Beaches", "Golf", "Water Sports"] },
    ],
  },
  // ΓöÇΓöÇ AMERICAS ΓöÇΓöÇ
  {
    code: "US", flag: "≡ƒç║≡ƒç╕", name: "United States", currency: "USD", symbol: "$", currencyName: "US Dollar", continent: "Americas",
    capital: "Washington D.C.", heroImage: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&h=600&fit=crop",
    description: "From Grand Canyon deserts to Manhattan skyscrapers, Hawaiian shores to Alaskan tundra ΓÇö 50 states of staggering diversity.",
    topAttractions: ["Grand Canyon", "Times Square", "Yellowstone", "Golden Gate Bridge", "Walt Disney World"],
    cuisine: ["BBQ", "Clam Chowder", "Deep Dish Pizza", "Lobster Roll", "Biscuits & Gravy", "Key Lime Pie"],
    bestTime: "Year-round (varies by region)",
    cities: [
      { name: "New York", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop", description: "The city that never sleeps ΓÇö Central Park, Times Square, the Met and New York pizza at 2am.", attractions: ["Statue of Liberty", "Central Park", "Metropolitan Museum", "Brooklyn Bridge", "High Line"], bestFor: ["Culture", "Food", "Architecture"] },
      { name: "Los Angeles", image: "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=600&h=400&fit=crop", description: "City of Angels ΓÇö Hollywood, Malibu beaches, In-N-Out Burger and the Getty Center.", attractions: ["Hollywood Walk of Fame", "Getty Center", "Venice Beach", "Griffith Observatory", "Santa Monica Pier"], bestFor: ["Entertainment", "Beaches", "Film"] },
      { name: "Miami", image: "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=600&h=400&fit=crop", description: "Neon Art Deco, Cuban coffee, South Beach, Latin nightlife and world-class art fairs.", attractions: ["South Beach", "Art Deco Historic District", "Wynwood Walls", "Little Havana", "Everglades"], bestFor: ["Beaches", "Nightlife", "Art"] },
      { name: "Las Vegas", image: "https://images.unsplash.com/photo-1581351721010-8cf859cb14a4?w=600&h=400&fit=crop", description: "The Entertainment Capital of the World ΓÇö casinos, Cirque du Soleil, buffets and the Bellagio fountains.", attractions: ["The Strip", "Bellagio Fountains", "Fremont Street", "Grand Canyon Tour", "Mob Museum"], bestFor: ["Entertainment", "Gambling", "Shows"] },
      { name: "San Francisco", image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&h=400&fit=crop", description: "Cable cars, the Golden Gate, sourdough clam chowder and Silicon Valley ΓÇö America's most beautiful city.", attractions: ["Golden Gate Bridge", "Alcatraz", "Fisherman's Wharf", "Muir Woods", "Chinatown"], bestFor: ["Scenery", "Tech Culture", "Food"] },
      { name: "New Orleans", image: "https://images.unsplash.com/photo-1571893544028-06b07af6dade?w=600&h=400&fit=crop", description: "The Crescent City ΓÇö jazz on Frenchmen Street, Mardi Gras, beignets at Caf├⌐ Du Monde and voodoo history.", attractions: ["French Quarter", "Bourbon Street", "St Charles Streetcar", "Mardi Gras", "Preservation Hall Jazz"], bestFor: ["Music", "Food", "Culture"] },
    ],
  },
  {
    code: "BR", flag: "≡ƒçº≡ƒç╖", name: "Brazil", currency: "BRL", symbol: "R$", currencyName: "Brazilian Real", continent: "Americas",
    capital: "Bras├¡lia", heroImage: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200&h=600&fit=crop",
    description: "Christ the Redeemer, Carnival samba, Amazon rainforest, Pantanal jaguars and Copacabana beach sunsets.",
    topAttractions: ["Christ the Redeemer", "Iguazu Falls", "Amazon Rainforest", "Pantanal", "Len├º├│is Maranhenses"],
    cuisine: ["Churrasco", "Feijoada", "P├úo de Queijo", "Caipirinha", "Brigadeiro", "A├ºa├¡ Bowl"],
    bestTime: "December ΓÇô March (Rio Carnival)",
    cities: [
      { name: "Rio de Janeiro", image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600&h=400&fit=crop", description: "The Marvellous City ΓÇö Christ the Redeemer, Copacabana, Sugar Loaf Mountain and samba schools.", attractions: ["Christ the Redeemer", "Sugarloaf Mountain", "Copacabana Beach", "Ipanema", "Carnival"], bestFor: ["Beaches", "Carnival", "Nightlife"] },
      { name: "S├úo Paulo", image: "https://images.unsplash.com/photo-1544989164-31b9b3c16e6c?w=600&h=400&fit=crop", description: "Brazil's megalopolis ΓÇö South America's finest restaurants, galleries and nightlife in a concrete jungle.", attractions: ["Ibirapuera Park", "Pinacoteca do Estado", "MASP Museum", "Vila Madalena", "Liberdade Japan-Town"], bestFor: ["Gastronomy", "Art", "Nightlife"] },
      { name: "Salvador", image: "https://images.unsplash.com/photo-1559628233-100c798642d5?w=600&h=400&fit=crop", description: "The cradle of Afro-Brazilian culture ΓÇö baroque churches, Pelourinho cobblestone streets and incredible beaches.", attractions: ["Pelourinho", "Bonfim Church", "Capoeira Shows", "Mercado Modelo", "Morro de S├úo Paulo"], bestFor: ["Culture", "Beaches", "Music"] },
    ],
  },
  {
    code: "MX", flag: "≡ƒç▓≡ƒç╜", name: "Mexico", currency: "MXN", symbol: "Mex$", currencyName: "Mexican Peso", continent: "Americas",
    capital: "Mexico City", heroImage: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=1200&h=600&fit=crop",
    description: "Ancient Mayan pyramids, turquoise Caribbean cenotes, mezcal bars, mariachi music and the world's best tacos.",
    topAttractions: ["Chichen Itza", "Cenotes Yucat├ín", "Teotihuacan Pyramids", "Copper Canyon", "Mexico City Z├│calo"],
    cuisine: ["Tacos", "Guacamole", "Mole", "Chiles Rellenos", "Elote", "Churros"],
    bestTime: "November ΓÇô April",
    cities: [
      { name: "Canc├║n", image: "https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=600&h=400&fit=crop", description: "Mexico's Caribbean playground ΓÇö turquoise waters, Mayan ruins at Tulum and spectacular cenote swimming.", attractions: ["Hotel Zone Beaches", "Tulum Ruins", "Cenote Ik Kil", "Isla Mujeres", "Coba Pyramid"], bestFor: ["Beaches", "Water Sports", "Ruins"] },
      { name: "Mexico City", image: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=600&h=400&fit=crop", description: "One of the world's greatest cities ΓÇö Aztec ruins below the Z├│calo, Frida Kahlo's Blue House and incredible street food.", attractions: ["Teotihuacan", "Frida Kahlo Museum", "Z├│calo", "Xochimilco", "Lucha Libre"], bestFor: ["Culture", "Food", "History"] },
      { name: "Oaxaca", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop", description: "Mexico's culinary and artistic soul ΓÇö mole negro, mezcal distilleries, Zapotec ruins and Day of the Dead.", attractions: ["Monte Alb├ín", "Hierve el Agua", "Mercado Benito Ju├írez", "Mezcal Tasting", "Textile Cooperatives"], bestFor: ["Food", "Culture", "Indigenous Heritage"] },
    ],
  },
  {
    code: "AR", flag: "≡ƒçª≡ƒç╖", name: "Argentina", currency: "ARS", symbol: "$", currencyName: "Argentine Peso", continent: "Americas",
    capital: "Buenos Aires", heroImage: "https://images.unsplash.com/photo-1612294037637-ec328d0e075e?w=1200&h=600&fit=crop",
    description: "Tango in Buenos Aires, Malbec in Mendoza, Patagonian glaciers, Iguaz├║ Falls and Tierra del Fuego wilderness.",
    topAttractions: ["Perito Moreno Glacier", "Iguaz├║ Falls", "Buenos Aires Recoleta", "Mendoza Wineries", "Torres del Paine"],
    cuisine: ["Asado", "Empanadas", "Medialunas", "Milanesa", "Dulce de Leche", "Malbec Wine"],
    bestTime: "October ΓÇô April",
    cities: [
      { name: "Buenos Aires", image: "https://images.unsplash.com/photo-1612294037637-ec328d0e075e?w=600&h=400&fit=crop", description: "The Paris of South America ΓÇö tango milongas, Boca football, La Recoleta cemetery and endless steakhouses.", attractions: ["La Boca", "Recoleta Cemetery", "San Telmo Market", "Tango Shows", "Puerto Madero"], bestFor: ["Tango", "Food", "Football"] },
      { name: "Patagonia", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop", description: "The world's end ΓÇö Perito Moreno Glacier calving, condors soaring and the dramatic Fitzroy massif.", attractions: ["Perito Moreno Glacier", "Mount Fitz Roy", "Torres del Paine", "Beagle Channel", "Whale Watching"], bestFor: ["Adventure", "Wildlife", "Nature"] },
      { name: "Mendoza", image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&h=400&fit=crop", description: "Argentina's wine capital at the foot of the Andes ΓÇö Malbec bodegas, cycling vineyard routes and snow-capped peaks.", attractions: ["Malbec Wine Tours", "Aconcagua Views", "Luj├ín de Cuyo Wineries", "Olive Oil Tastings", "Rafting"], bestFor: ["Wine", "Mountains", "Cycling"] },
    ],
  },
  // ΓöÇΓöÇ AFRICA ΓöÇΓöÇ
  {
    code: "ZA", flag: "≡ƒç┐≡ƒçª", name: "South Africa", currency: "ZAR", symbol: "R", currencyName: "South African Rand", continent: "Africa",
    capital: "Pretoria", heroImage: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&h=600&fit=crop",
    description: "Cape Town's Table Mountain, Big Five safaris, the Garden Route, Winelands and the birthplace of Mandela.",
    topAttractions: ["Table Mountain", "Kruger National Park", "Cape of Good Hope", "Robben Island", "Drakensberg Mountains"],
    cuisine: ["Braai", "Bobotie", "Bunny Chow", "Biltong", "Malva Pudding", "Rooibos Tea"],
    bestTime: "May ΓÇô September (safari) & November ΓÇô January (Cape Town)",
    cities: [
      { name: "Cape Town", image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&h=400&fit=crop", description: "One of the world's most beautiful cities ΓÇö Table Mountain, Boulders Beach penguins and Winelands day trips.", attractions: ["Table Mountain", "Robben Island", "Boulders Beach", "V&A Waterfront", "Cape Winelands"], bestFor: ["Scenery", "Wine", "Adventure"] },
      { name: "Kruger Park", image: "https://images.unsplash.com/photo-1551966775-a4daa4d38b07?w=600&h=400&fit=crop", description: "Africa's premier game reserve ΓÇö see the Big Five (lion, leopard, rhino, elephant, buffalo) in their natural habitat.", attractions: ["Big Five Game Drives", "Walking Safaris", "Blyde River Canyon", "Panorama Route", "Bush Sundowners"], bestFor: ["Safari", "Wildlife", "Photography"] },
      { name: "Johannesburg", image: "https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=600&h=400&fit=crop", description: "Egoli, City of Gold ΓÇö Apartheid Museum, Soweto, Maboneng arts district and world-class dining.", attractions: ["Apartheid Museum", "Soweto", "Gold Reef City", "Maboneng Precinct", "Constitution Hill"], bestFor: ["History", "Culture", "Food"] },
    ],
  },
  {
    code: "KE", flag: "≡ƒç░≡ƒç¬", name: "Kenya", currency: "KES", symbol: "KSh", currencyName: "Kenyan Shilling", continent: "Africa",
    capital: "Nairobi", heroImage: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&h=600&fit=crop",
    description: "The Great Migration, Mount Kenya, Maasai warriors, dhow-sailed Swahili coast and flamingo-pink Rift Valley lakes.",
    topAttractions: ["Maasai Mara Great Migration", "Mount Kenya", "Amboseli Elephants", "Diani Beach", "Lake Nakuru Flamingos"],
    cuisine: ["Nyama Choma", "Ugali", "Sukuma Wiki", "Mandazi", "Pilau Rice", "Tusker Beer"],
    bestTime: "July ΓÇô October (migration)",
    cities: [
      { name: "Nairobi", image: "https://images.unsplash.com/photo-1575842250373-5d0d1e5b02c5?w=600&h=400&fit=crop", description: "Africa's safari capital ΓÇö giraffes in the city, Maasai Market crafts and the Karen Blixen Museum.", attractions: ["Giraffe Centre", "David Sheldrick Elephant Orphanage", "Maasai Market", "Karen Blixen Museum", "Nairobi National Park"], bestFor: ["Wildlife", "Culture", "Gateway to Safari"] },
      { name: "Maasai Mara", image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&h=400&fit=crop", description: "Kenya's most iconic reserve ΓÇö the world's greatest wildlife spectacle, the annual wildebeest migration.", attractions: ["Wildebeest Migration", "Big Cat Game Drives", "Maasai Village Visit", "Hot Air Balloon Safari", "Mara River Crossing"], bestFor: ["Safari", "Photography", "Migration"] },
      { name: "Diani Beach", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop", description: "Kenya's finest beach ΓÇö white coral sand, turquoise Indian Ocean and a backdrop of colobus monkey forests.", attractions: ["Snorkelling", "Kite Surfing", "Colobus Conservation", "Shimba Hills Elephants", "Kisite-Mpunguti Marine Park"], bestFor: ["Beaches", "Water Sports", "Wildlife"] },
    ],
  },
  {
    code: "EG", flag: "≡ƒç¬≡ƒç¼", name: "Egypt", currency: "EGP", symbol: "┬ú", currencyName: "Egyptian Pound", continent: "Africa",
    capital: "Cairo", heroImage: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=1200&h=600&fit=crop",
    description: "Civilisation's cradle ΓÇö the Pyramids of Giza, Valley of the Kings, Nile cruises and Red Sea diving.",
    topAttractions: ["Pyramids of Giza & Sphinx", "Valley of the Kings", "Abu Simbel", "Egyptian Museum", "Karnak Temple"],
    cuisine: ["Koshary", "Ful Medames", "Shawarma", "Om Ali", "Mahshi", "Basbousa"],
    bestTime: "October ΓÇô April",
    cities: [
      { name: "Cairo", image: "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?w=600&h=400&fit=crop", description: "One of the ancient world's great cities ΓÇö Pyramids of Giza, the Egyptian Museum and chaotic beautiful Khan el-Khalili.", attractions: ["Pyramids & Sphinx", "Egyptian Museum", "Khan el-Khalili Bazaar", "Coptic Cairo", "Saladin Citadel"], bestFor: ["Ancient History", "Culture", "Bazaars"] },
      { name: "Luxor", image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=600&h=400&fit=crop", description: "The world's greatest open-air museum ΓÇö Valley of the Kings, Karnak Temple and the Temple of Hatshepsut.", attractions: ["Valley of the Kings", "Karnak Temple", "Luxor Temple", "Colossi of Memnon", "Balloon over West Bank"], bestFor: ["Ancient History", "Temples", "Nile Cruises"] },
      { name: "Sharm El-Sheikh", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop", description: "Red Sea diving and snorkelling capital ΓÇö Ras Mohammed coral reefs and Sinai mountain monasteries.", attractions: ["Ras Mohammed National Park", "Tiran Island Dive", "St Catherine's Monastery", "Naama Bay", "Bedouin Tours"], bestFor: ["Diving", "Snorkelling", "Desert Tours"] },
    ],
  },
  {
    code: "MA", flag: "≡ƒç▓≡ƒçª", name: "Morocco", currency: "MAD", symbol: "╪».┘à.", currencyName: "Moroccan Dirham", continent: "Africa",
    capital: "Rabat", heroImage: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1200&h=600&fit=crop",
    description: "Labyrinthine medinas, Sahara sand dunes, blue Chefchaouen, Moorish architecture and fragrant spice souks.",
    topAttractions: ["Marrakech Djemaa el-Fna", "Sahara Desert", "Fes Medina", "Chefchaouen Blue City", "Atlas Mountains"],
    cuisine: ["Tagine", "Couscous", "Harira Soup", "Bastilla", "Mint Tea", "Msemen"],
    bestTime: "March ΓÇô May & September ΓÇô November",
    cities: [
      { name: "Marrakech", image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&h=400&fit=crop", description: "The Red City ΓÇö Djemaa el-Fna square, Majorelle Garden, the souks and hammam steam baths.", attractions: ["Djemaa el-Fna", "Majorelle Garden", "Bahia Palace", "Spice Souk", "Hammam"], bestFor: ["Culture", "Shopping", "Food"] },
      { name: "Fes", image: "https://images.unsplash.com/photo-1489749798305-4fea3be63d26?w=600&h=400&fit=crop", description: "The spiritual capital ΓÇö the world's largest medieval medina, leather tanneries and Quaraouiyine University.", attractions: ["Chouara Tannery", "Al-Qarawiyyin Mosque", "Bou Inania Medersa", "Medina Souks", "Fes el-Bali"], bestFor: ["History", "Craft", "Photography"] },
      { name: "Sahara Desert", image: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=600&h=400&fit=crop", description: "Merzouga's golden Erg Chebbi dunes ΓÇö camel trekking, Berber camp nights under a billion stars.", attractions: ["Camel Trek", "Berber Desert Camp", "Erg Chebbi Dunes", "Sandboarding", "Sunrise & Sunset"], bestFor: ["Adventure", "Photography", "Stargazing"] },
      { name: "Chefchaouen", image: "https://images.unsplash.com/photo-1553835973-dec43bfddbeb?w=600&h=400&fit=crop", description: "The Blue Pearl ΓÇö a mountain town where every wall and staircase is painted in shades of blue.", attractions: ["Blue Streets Photography", "Ras El Maa Waterfall", "Plaza Uta el-Hammam", "Rif Mountains Hike", "Goat Cheese"], bestFor: ["Photography", "Relaxation", "Hiking"] },
    ],
  },
  // ΓöÇΓöÇ MIDDLE EAST ΓöÇΓöÇ
  {
    code: "TR", flag: "≡ƒç╣≡ƒç╖", name: "Turkey", currency: "TRY", symbol: "Γé║", currencyName: "Turkish Lira", continent: "Asia",
    capital: "Ankara", heroImage: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=1200&h=600&fit=crop",
    description: "Where East meets West ΓÇö Hagia Sophia, Cappadocia's fairy chimneys, turquoise Aegean coast and hamam steam baths.",
    topAttractions: ["Hagia Sophia", "Cappadocia Hot Air Balloons", "Pamukkale Travertines", "Ephesus Ruins", "Bosphorus Strait"],
    cuisine: ["Baklava", "Doner Kebab", "Lahmacun", "Meze", "Turkish Delight", "Simit"],
    bestTime: "April ΓÇô June & September ΓÇô October",
    cities: [
      { name: "Istanbul", image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600&h=400&fit=crop", description: "The only city on two continents ΓÇö Hagia Sophia, the Blue Mosque, Grand Bazaar and Bosphorus sunset cruises.", attractions: ["Hagia Sophia", "Blue Mosque", "Grand Bazaar", "Bosphorus Cruise", "Topkapi Palace"], bestFor: ["History", "Culture", "Food"] },
      { name: "Cappadocia", image: "https://images.unsplash.com/photo-1570939274717-7eda259b3773?w=600&h=400&fit=crop", description: "A lunar landscape of fairy chimneys, underground cities and the world's most famous hot air balloon rides.", attractions: ["Hot Air Balloon Sunrise", "G├╢reme Open Air Museum", "Underground Cities", "Fairy Chimneys", "Cave Hotels"], bestFor: ["Balloons", "Photography", "Unique Experiences"] },
      { name: "Antalya", image: "https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=600&h=400&fit=crop", description: "Turkey's turquoise riviera ΓÇö Roman harbour, ancient Lycian ruins and dazzling beaches backed by the Taurus Mountains.", attractions: ["Kalei├ºi Old Town", "D├╝den Waterfalls", "Aspendos Theatre", "Phaselis Ruins", "Konyaalt─▒ Beach"], bestFor: ["Beaches", "History", "Water Sports"] },
    ],
  },
  // ΓöÇΓöÇ OCEANIA ΓöÇΓöÇ
  {
    code: "AU", flag: "≡ƒçª≡ƒç║", name: "Australia", currency: "AUD", symbol: "A$", currencyName: "Australian Dollar", continent: "Oceania",
    capital: "Canberra", heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop",
    description: "Sydney's Opera House, Great Barrier Reef, Uluru, kangaroos and some of the planet's most remote wilderness.",
    topAttractions: ["Sydney Opera House", "Great Barrier Reef", "Uluru", "Great Ocean Road", "Daintree Rainforest"],
    cuisine: ["Barramundi", "Tim Tams", "Vegemite on Toast", "Pavlova", "Meat Pie", "Flat White Coffee"],
    bestTime: "September ΓÇô November & March ΓÇô May",
    cities: [
      { name: "Sydney", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop", description: "Harbour Bridge, Opera House, Bondi Beach and a relentless caf├⌐ culture ΓÇö Australia's global city.", attractions: ["Sydney Opera House", "Harbour Bridge Climb", "Bondi Beach", "Manly Ferry", "The Rocks"], bestFor: ["Architecture", "Beaches", "Nightlife"] },
      { name: "Melbourne", image: "https://images.unsplash.com/photo-1514395462725-fb4566210144?w=600&h=400&fit=crop", description: "Australia's cultural capital ΓÇö laneways art, flat whites, the MCG, Great Ocean Road and Yarra Valley wine.", attractions: ["Federation Square", "Graffiti Laneways", "Melbourne Cricket Ground", "Queen Victoria Market", "Phillip Island Penguins"], bestFor: ["Culture", "Food", "Sport"] },
      { name: "Gold Coast", image: "https://images.unsplash.com/photo-1529967297634-aaa4be2d3d4b?w=600&h=400&fit=crop", description: "Surfers Paradise beaches, Wet'n'Wild theme parks, hinterland rainforest and dolphin-watching cruises.", attractions: ["Surfers Paradise Beach", "Sea World", "Springbrook National Park", "Currumbin Wildlife Sanctuary", "Warner Bros Movie World"], bestFor: ["Beaches", "Theme Parks", "Surfing"] },
      { name: "Cairns", image: "https://images.unsplash.com/photo-1589303673404-bd4c5b15d44b?w=600&h=400&fit=crop", description: "Gateway to the Great Barrier Reef and Daintree Rainforest ΓÇö the world's two greatest natural wonders side by side.", attractions: ["Great Barrier Reef Snorkel", "Daintree Rainforest", "Kuranda Village Railway", "Fitzroy Island", "Tjapukai Cultural Park"], bestFor: ["Reef Diving", "Rainforest", "Indigenous Culture"] },
    ],
  },
  {
    code: "NZ", flag: "≡ƒç│≡ƒç┐", name: "New Zealand", currency: "NZD", symbol: "NZ$", currencyName: "New Zealand Dollar", continent: "Oceania",
    capital: "Wellington", heroImage: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1200&h=600&fit=crop",
    description: "Middle-earth landscapes ΓÇö fiords, glaciers, geysers, Maori culture, bungee jumping and the world's finest sauvignon blanc.",
    topAttractions: ["Milford Sound", "Hobbiton", "Rotorua Geothermal", "Franz Josef Glacier", "Abel Tasman"],
    cuisine: ["Hangi", "Pavlova", "Whitebait Fritters", "Sauvignon Blanc", "Manuka Honey", "L&P"],
    bestTime: "December ΓÇô February (summer)",
    cities: [
      { name: "Auckland", image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=600&h=400&fit=crop", description: "City of Sails on two harbours ΓÇö Sky Tower, Waiheke Island wineries and the best seafood in the Pacific.", attractions: ["Sky Tower", "Waiheke Island", "Rangitoto Volcanic Island", "Auckland Museum", "Viaduct Harbour"], bestFor: ["Sailing", "Wine", "Food"] },
      { name: "Queenstown", image: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=600&h=400&fit=crop", description: "The adventure capital of the world ΓÇö bungee jumping, skydiving, jet boating and milord-level scenery.", attractions: ["AJ Hackett Bungee", "Milford Sound", "Coronet Peak Skiing", "Jet Boat Shotover", "Skyline Gondola"], bestFor: ["Adventure", "Skiing", "Scenery"] },
      { name: "Rotorua", image: "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=600&h=400&fit=crop", description: "Geothermal heartland ΓÇö boiling mud pools, geysers, rainbow-tinted springs and Maori cultural experiences.", attractions: ["Te Puia Geyser", "Waitomo Glowworm Caves", "Wai-O-Tapu Thermal", "Maori Hangi", "Redwood Treewalk"], bestFor: ["Geothermal", "Maori Culture", "Nature"] },
    ],
  },
  // ΓöÇΓöÇ SCANDINAVIA ΓöÇΓöÇ
  {
    code: "NO", flag: "≡ƒç│≡ƒç┤", name: "Norway", currency: "NOK", symbol: "kr", currencyName: "Norwegian Krone", continent: "Europe",
    capital: "Oslo", heroImage: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&h=600&fit=crop",
    description: "Northern Lights, dramatic fjords, Viking heritage, Midnight Sun and the world's most spectacular road trips.",
    topAttractions: ["Northern Lights Troms├╕", "Geirangerfjord", "Preikestolen Pulpit Rock", "Viking Ship Museum", "Lofoten Islands"],
    cuisine: ["Gravlaks", "Lutefisk", "Raspeballer", "Brunost", "Rakfisk", "Cloudberries"],
    bestTime: "June ΓÇô August (midnight sun) & November ΓÇô February (Northern Lights)",
    cities: [
      { name: "Oslo", image: "https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?w=600&h=400&fit=crop", description: "Scandinavia's most dynamic capital ΓÇö the Vigeland Park sculptures, Viking Ship Museum and fjord kayaking.", attractions: ["Viking Ship Museum", "Vigeland Park", "Munch Museum", "Akershus Fortress", "Oslo Fjord Kayak"], bestFor: ["Culture", "Nature", "Architecture"] },
      { name: "Bergen", image: "https://images.unsplash.com/photo-1547448415-e9f5b28e570d?w=600&h=400&fit=crop", description: "Gateway to the fjords ΓÇö the colourful wooden Bryggen Wharf and Fl├Ñm Railway are two of Norway's finest experiences.", attractions: ["Bryggen Wharf", "Fl├Ñm Railway", "Ulriken Cable Car", "Fish Market", "Fantoft Stave Church"], bestFor: ["Fjords", "Scenery", "Heritage"] },
      { name: "Troms├╕", image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&h=400&fit=crop", description: "The Northern Lights capital above the Arctic Circle ΓÇö midnight sun and polar nights with aurora borealis dancing overhead.", attractions: ["Northern Lights Chasing", "Troms├╕ Arctic Cathedral", "Husky Sledding", "Midnight Sun", "Whale Watching"], bestFor: ["Northern Lights", "Arctic Adventure", "Photography"] },
      { name: "Lofoten", image: "https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?w=600&h=400&fit=crop", description: "Dramatic archipelago above the Arctic Circle ΓÇö red fishing cabins on stilts, towering peaks and world-class surfing.", attractions: ["Reine Village", "├à Village", "Nusfjord", "Surfing", "Sea Eagle Safari"], bestFor: ["Photography", "Scenery", "Fishing"] },
    ],
  },
  {
    code: "IS", flag: "≡ƒç«≡ƒç╕", name: "Iceland", currency: "ISK", symbol: "kr", currencyName: "Icelandic Kr├│na", continent: "Europe",
    capital: "Reykjavik", heroImage: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=1200&h=600&fit=crop",
    description: "Fire and ice ΓÇö volcanoes, geysers, waterfalls, glaciers, Northern Lights and midnight sun in the land of the Vikings.",
    topAttractions: ["Northern Lights", "Golden Circle", "Blue Lagoon", "Ring Road", "J├╢kuls├írl├│n Glacier Lagoon"],
    cuisine: ["Skyr", "H├íkarl", "Lamb Soup", "Hot Dogs", "Arctic Char", "Brenniv├¡n"],
    bestTime: "June ΓÇô August (midnight sun) & September ΓÇô March (Northern Lights)",
    cities: [
      { name: "Reykjavik", image: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=600&h=400&fit=crop", description: "The world's northernmost capital ΓÇö colourful houses, Hallgr├¡mskirkja Church and geothermal pools.", attractions: ["Hallgr├¡mskirkja", "Harpa Concert Hall", "Laugardalslaug Pool", "Golden Circle", "Blue Lagoon"], bestFor: ["Northern Lights", "Hot Springs", "Day Trips"] },
      { name: "Golden Circle", image: "https://images.unsplash.com/photo-1520769945061-0a448c463865?w=600&h=400&fit=crop", description: "Iceland's classic tourist route ΓÇö ├₧ingvellir, Geysir and the thundering Gullfoss waterfall.", attractions: ["├₧ingvellir National Park", "Strokkur Geyser", "Gullfoss Waterfall", "Secret Lagoon", "Kerid Crater"], bestFor: ["Nature", "Geology", "Photography"] },
      { name: "South Coast", image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&h=400&fit=crop", description: "Iceland's most dramatic drive ΓÇö black sand beaches, glacier walks, waterfall chasing and the J├╢kuls├írl├│n Lagoon.", attractions: ["J├╢kuls├írl├│n Glacier Lagoon", "Sk├│gafoss Waterfall", "Seljalandsfoss", "Reynisfjara Black Beach", "Vatnaj├╢kull Glacier"], bestFor: ["Glaciers", "Waterfalls", "Photography"] },
    ],
  },
  // ΓöÇΓöÇ MORE ASIA ΓöÇΓöÇ
  {
    code: "SA", flag: "≡ƒç╕≡ƒçª", name: "Saudi Arabia", currency: "SAR", symbol: "∩╖╝", currencyName: "Saudi Riyal", continent: "Asia",
    capital: "Riyadh", heroImage: "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=1200&h=600&fit=crop",
    description: "Ancient Nabataean cities, Red Sea coral reefs, the world's largest oil reserves and a society opening rapidly to tourism.",
    topAttractions: ["AlUla & Hegra", "Edge of the World Riyadh", "Mada'in Saleh", "Red Sea Diving", "Dir'iyah"],
    cuisine: ["Kabsa", "Jareesh", "Harees", "Mutabbal", "Al Baik Chicken", "Camel Milk"],
    bestTime: "November ΓÇô February",
    cities: [
      { name: "Riyadh", image: "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=600&h=400&fit=crop", description: "Saudi Arabia's modern capital rising from desert ΓÇö Kingdom Tower, Dir'iyah mud-brick ruins and excellent restaurants.", attractions: ["Kingdom Centre Tower", "Dir'iyah UNESCO Site", "National Museum", "Al Bujairi Quarter", "Edge of the World"], bestFor: ["Architecture", "Culture", "Desert Tours"] },
      { name: "AlUla", image: "https://images.unsplash.com/photo-1609861671697-22659501c5ae?w=600&h=400&fit=crop", description: "Saudi Arabia's Petra ΓÇö the ancient Nabataean tombs of Hegra carved into rose-red sandstone mountains.", attractions: ["Hegra Nabataean Tombs", "Elephant Rock", "Old Town AlUla", "Rock Art", "Stargazing Desert Camps"], bestFor: ["Ancient Heritage", "Photography", "Desert"] },
    ],
  },
  {
    code: "LK", flag: "≡ƒç▒≡ƒç░", name: "Sri Lanka", currency: "LKR", symbol: "Rs", currencyName: "Sri Lankan Rupee", continent: "Asia",
    capital: "Sri Jayawardenepura Kotte", heroImage: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1200&h=600&fit=crop",
    description: "The Pearl of the Indian Ocean ΓÇö ancient Sigiriya rock fortress, Ceylon tea plantations, leopard safaris and beach bliss.",
    topAttractions: ["Sigiriya Rock Fortress", "Temple of the Tooth Kandy", "Ella Train Ride", "Yala National Park", "Galle Fort"],
    cuisine: ["Rice & Curry", "Hoppers", "Kottu Roti", "Fish Ambul Thiyal", "Watalappam", "Ceylon Tea"],
    bestTime: "November ΓÇô April (west coast) & May ΓÇô August (east coast)",
    cities: [
      { name: "Colombo", image: "https://images.unsplash.com/photo-1580337957583-c49e32d60640?w=600&h=400&fit=crop", description: "Sri Lanka's vibrant capital ΓÇö Dutch colonial Galle Face Green, Pettah market and excellent street food.", attractions: ["Galle Face Green", "Pettah Market", "Gangaramaya Temple", "Colombo Museum", "Dutch Hospital"], bestFor: ["Food", "Culture", "Colonial Heritage"] },
      { name: "Sigiriya", image: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?w=600&h=400&fit=crop", description: "The Lion Rock ΓÇö a UNESCO World Heritage fortress rising 200m above the jungle, topped by ancient royal gardens.", attractions: ["Sigiriya Rock Climb", "Fresco Paintings", "Water Gardens", "Pidurangala Rock", "Village Cycle Tours"], bestFor: ["Heritage", "Adventure", "Photography"] },
      { name: "Ella", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop", description: "A cool hill station in misty tea country ΓÇö the Ella Gap, Nine Arch Bridge and the classic train journey from Kandy.", attractions: ["Nine Arch Bridge", "Little Adam's Peak", "Ella Gap Viewpoint", "Ravana Waterfall", "Tea Factory Tour"], bestFor: ["Tea Country", "Hiking", "Photography"] },
    ],
  },
  {
    code: "KH", flag: "≡ƒç░≡ƒç¡", name: "Cambodia", currency: "KHR", symbol: "ßƒ¢", currencyName: "Cambodian Riel", continent: "Asia",
    capital: "Phnom Penh", heroImage: "https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&h=600&fit=crop",
    description: "The ancient Khmer Empire's crowning glory ΓÇö Angkor Wat at sunrise, floating villages and a resilient, warm-hearted people.",
    topAttractions: ["Angkor Wat", "Bayon Temple", "Ta Prohm Tree Roots", "Tonle Sap Lake", "Royal Palace Phnom Penh"],
    cuisine: ["Fish Amok", "Lok Lak", "Bai Sach Chrouk", "Nom Banh Chok", "Kuy Teav", "Iced Coffee"],
    bestTime: "November ΓÇô March",
    cities: [
      { name: "Siem Reap", image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&h=400&fit=crop", description: "Gateway to Angkor ΓÇö the greatest religious monument ever built, a UNESCO-listed temple complex spanning 400 km┬▓.", attractions: ["Angkor Wat Sunrise", "Bayon Temple", "Ta Prohm", "Tonle Sap Floating Village", "Pub Street"], bestFor: ["Ancient Temples", "Culture", "History"] },
    ],
  },
  {
    code: "MM", flag: "≡ƒç▓≡ƒç▓", name: "Myanmar", currency: "MMK", symbol: "K", currencyName: "Myanmar Kyat", continent: "Asia",
    capital: "Naypyidaw", heroImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop",
    description: "Ancient Bagan's 2,000 temples, Inle Lake's leg-rowing fishermen and Shwedagon Pagoda's golden glory.",
    topAttractions: ["Bagan Temples", "Inle Lake", "Shwedagon Pagoda", "Mandalay Hill", "Hpa-an Caves"],
    cuisine: ["Mohinga", "Tea Leaf Salad", "Shan Noodles", "Laphet", "Fish Curry", "Coconut Noodle Soup"],
    bestTime: "October ΓÇô February",
    cities: [
      { name: "Bagan", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop", description: "A plateau of 2,000 ancient Buddhist temples and pagodas ΓÇö one of Asia's most awe-inspiring archaeological sites.", attractions: ["Sunrise Hot Air Balloon", "Ananda Temple", "Shwezigon Pagoda", "Dhammayan Gyi", "E-Bike Temple Tour"], bestFor: ["Ancient Temples", "Sunrise Views", "Spirituality"] },
    ],
  },
  // ΓöÇΓöÇ ADDITIONAL COUNTRIES ΓöÇΓöÇ
  {
    code: "CA", flag: "≡ƒç¿≡ƒçª", name: "Canada", currency: "CAD", symbol: "C$", currencyName: "Canadian Dollar", continent: "Americas",
    capital: "Ottawa", heroImage: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200&h=600&fit=crop",
    description: "Niagara Falls, Rocky Mountain glaciers, Northern Lights in Yukon, maple syrup and some of the world's friendliest people.",
    topAttractions: ["Niagara Falls", "Banff National Park", "CN Tower", "Quebec Old City", "Whistler Mountains"],
    cuisine: ["Poutine", "Butter Tarts", "BeaverTails", "Nanaimo Bars", "Smoked Meat", "Maple Syrup"],
    bestTime: "June ΓÇô September & December ΓÇô March (skiing)",
    cities: [
      { name: "Toronto", image: "https://images.unsplash.com/photo-1517090186835-e348b621c9ca?w=600&h=400&fit=crop", description: "Canada's largest city and one of the world's most multicultural ΓÇö CN Tower, Kensington Market and Niagara day trips.", attractions: ["CN Tower", "Niagara Falls Day Trip", "Kensington Market", "Royal Ontario Museum", "Distillery District"], bestFor: ["Multiculture", "Food", "Architecture"] },
      { name: "Vancouver", image: "https://images.unsplash.com/photo-1559628233-100c798642d5?w=600&h=400&fit=crop", description: "Pacific paradise ΓÇö Stanley Park seawall, ski-in ski-out mountains and the best sushi outside Japan.", attractions: ["Stanley Park", "Granville Island Market", "Whistler Blackcomb", "Capilano Suspension Bridge", "Gastown"], bestFor: ["Outdoors", "Skiing", "Food"] },
      { name: "Banff", image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=600&h=400&fit=crop", description: "Canada's most iconic national park ΓÇö turquoise Lake Louise, Moraine Lake and the glacier-draped Icefields Parkway.", attractions: ["Lake Louise", "Moraine Lake", "Icefields Parkway", "Johnston Canyon", "Banff Hot Springs"], bestFor: ["Mountain Scenery", "Hiking", "Wildlife"] },
    ],
  },
  {
    code: "ZW", flag: "≡ƒç┐≡ƒç╝", name: "Zimbabwe", currency: "ZWL", symbol: "Z$", currencyName: "Zimbabwe Dollar", continent: "Africa",
    capital: "Harare", heroImage: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&h=600&fit=crop",
    description: "Victoria Falls, the great Zimbabwe ruins, Hwange's elephants and a warm-hearted culture of resilience.",
    topAttractions: ["Victoria Falls", "Hwange National Park", "Great Zimbabwe Ruins", "Mana Pools", "Matobo Hills"],
    cuisine: ["Sadza", "Muriwo", "Biltong", "Matemba", "Roasted Mealies", "Maheu"],
    bestTime: "April ΓÇô October",
    cities: [
      { name: "Victoria Falls", image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&h=400&fit=crop", description: "The Smoke that Thunders ΓÇö the world's largest waterfall, bungee jumping and white-water rafting on the Zambezi.", attractions: ["Victoria Falls", "Zambezi White Water Rafting", "Bungee Jumping Bridge", "Sunset Cruise", "Elephant Interactions"], bestFor: ["Adventure", "Nature", "Adrenaline"] },
    ],
  },
  {
    code: "PH", flag: "≡ƒç╡≡ƒç¡", name: "Philippines", currency: "PHP", symbol: "Γé▒", currencyName: "Philippine Peso", continent: "Asia",
    capital: "Manila", heroImage: "https://images.unsplash.com/photo-1567462207-f46b99f2d86e?w=1200&h=600&fit=crop",
    description: "7,641 islands of powdery beaches, the Chocolate Hills, tarsiers, rice terraces and extraordinary diving.",
    topAttractions: ["Palawan El Nido", "Chocolate Hills Bohol", "Tarsiers", "Batanes Islands", "Intramuros Manila"],
    cuisine: ["Adobo", "Sinigang", "Lechon", "Halo-Halo", "Pancit", "Balut"],
    bestTime: "November ΓÇô May",
    cities: [
      { name: "Palawan", image: "https://images.unsplash.com/photo-1567462207-f46b99f2d86e?w=600&h=400&fit=crop", description: "The world's best island ΓÇö El Nido's dramatic limestone lagoons, Coron's WWII wrecks and pristine reefs.", attractions: ["El Nido Island Hopping", "Underground River", "Coron Wreck Diving", "Honda Bay", "Tubbataha Reef"], bestFor: ["Beaches", "Diving", "Snorkelling"] },
      { name: "Cebu", image: "https://images.unsplash.com/photo-1562865932-00eb8a1df4c7?w=600&h=400&fit=crop", description: "The Queen City of the South ΓÇö whale shark swimming, Magellan's Cross and the country's best nightlife outside Manila.", attractions: ["Whale Shark Swimming", "Magellan's Cross", "Kawasan Canyoneering", "Osme├▒a Peak", "Moalboal Diving"], bestFor: ["Whale Sharks", "Diving", "Nightlife"] },
    ],
  },
  {
    code: "PE", flag: "≡ƒç╡≡ƒç¬", name: "Peru", currency: "PEN", symbol: "S/", currencyName: "Peruvian Sol", continent: "Americas",
    capital: "Lima", heroImage: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&h=600&fit=crop",
    description: "Machu Picchu above the clouds, the Amazon basin, Lake Titicaca, Nazca Lines and the world's best cuisine.",
    topAttractions: ["Machu Picchu", "Nazca Lines", "Lake Titicaca", "Sacred Valley", "Amazon Jungle"],
    cuisine: ["Ceviche", "Lomo Saltado", "Causa", "Anticucho", "Pisco Sour", "Rocoto Relleno"],
    bestTime: "April ΓÇô October (dry season)",
    cities: [
      { name: "Cusco", image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&h=400&fit=crop", description: "The ancient Inca capital at 3,400m ΓÇö gateway to Machu Picchu, rainbow mountain and the Sacred Valley.", attractions: ["Machu Picchu", "Sacsayhuam├ín Fortress", "Rainbow Mountain", "Sacred Valley", "Inca Trail Trek"], bestFor: ["Inca Heritage", "Trekking", "High Altitude Adventure"] },
      { name: "Lima", image: "https://images.unsplash.com/photo-1588861577404-d56e6e5e2793?w=600&h=400&fit=crop", description: "Latin America's culinary capital ΓÇö Central, Maido and Astrid y Gast├│n top the world's best restaurant lists.", attractions: ["Larco Museum", "Huaca Pucllana", "Miraflores Cliffs", "Barranco Arts District", "Central Restaurant"], bestFor: ["Gastronomy", "History", "Culture"] },
    ],
  },
  {
    code: "KR", flag: "≡ƒç░≡ƒç╖", name: "South Korea", currency: "KRW", symbol: "Γé⌐", currencyName: "South Korean Won", continent: "Asia",
    capital: "Seoul", heroImage: "https://images.unsplash.com/photo-1549996096-b46a5d2d6a1b?w=1200&h=600&fit=crop",
    description: "K-pop, K-drama, kimchi, Buddhist temples, futuristic Seoul, cherry blossoms and the DMZ border experience.",
    topAttractions: ["Gyeongbokgung Palace Seoul", "Jeju Island", "Namsan Tower", "Bukchon Hanok Village", "DMZ"],
    cuisine: ["Kimchi", "Bulgogi", "Bibimbap", "Korean BBQ", "Tteokbokki", "Samgyeopsal"],
    bestTime: "March ΓÇô May (spring) & September ΓÇô November (autumn)",
    cities: [
      { name: "Seoul", image: "https://images.unsplash.com/photo-1549996096-b46a5d2d6a1b?w=600&h=400&fit=crop", description: "Asia's coolest city ΓÇö royal palaces next to K-pop studios, street food in Myeongdong and Han River picnics.", attractions: ["Gyeongbokgung Palace", "Bukchon Hanok Village", "Namsan Tower", "Myeongdong", "DMZ Tour"], bestFor: ["K-Pop", "Food", "Technology"] },
      { name: "Jeju Island", image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&h=400&fit=crop", description: "South Korea's Honeymoon Island ΓÇö Hallasan volcano, haenyeo diving women, lava tube caves and tangerine orchards.", attractions: ["Hallasan National Park", "Jeongbang Waterfall", "Manjanggul Cave", "Haenyeo Divers", "Seopjikoji Coast"], bestFor: ["Nature", "Romance", "Hiking"] },
    ],
  },
  {
    code: "CH", flag: "≡ƒç¿≡ƒç¡", name: "Switzerland", currency: "CHF", symbol: "Fr", currencyName: "Swiss Franc", continent: "Europe",
    capital: "Bern", heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop",
    description: "Alpine precision ΓÇö the Matterhorn, luxury ski resorts, chocolate, cheese fondue, Heidi villages and Alpine railways.",
    topAttractions: ["Matterhorn Zermatt", "Jungfraujoch Top of Europe", "Ch├óteau de Chillon", "Rhine Falls", "Bernese Oberland"],
    cuisine: ["Fondue", "Raclette", "R├╢sti", "Swiss Chocolate", "Z├╝rcher Geschnetzeltes", "Bircherm├╝esli"],
    bestTime: "June ΓÇô September & December ΓÇô March (skiing)",
    cities: [
      { name: "Zurich", image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=600&h=400&fit=crop", description: "Switzerland's financial capital on a crystal lake ΓÇö Old Town Lindenh├╝gel, Bahnhofstrasse shopping and excellent museums.", attractions: ["Lake Zurich Swim", "Old Town Lindenh├╝gel", "Kunsthaus Museum", "Bahnhofstrasse", "Rhine Falls Day Trip"], bestFor: ["Finance", "Culture", "Lake Activities"] },
      { name: "Zermatt", image: "https://images.unsplash.com/photo-1547448415-e9f5b28e570d?w=600&h=400&fit=crop", description: "Car-free village at the foot of the Matterhorn ΓÇö world-class skiing, the Glacier Express and sunset alpenglow.", attractions: ["Matterhorn Views", "Klein Matterhorn Cable Car", "Glacier Express Train", "Skiing & Snowboarding", "Mountain Hiking"], bestFor: ["Skiing", "Mountain Views", "Photography"] },
      { name: "Lucerne", image: "https://images.unsplash.com/photo-1562882755-e1f62d0dc5db?w=600&h=400&fit=crop", description: "The most romantic Swiss city ΓÇö Chapel Bridge, the Lion Monument, Mount Pilatus and Mount Rigi.", attractions: ["Chapel Bridge", "Mount Pilatus Cogwheel Train", "Transport Museum", "Lion Monument", "Lake Lucerne Cruise"], bestFor: ["Scenery", "History", "Day Trips"] },
    ],
  },
];

// Helper to find a country by code
export function getCountry(code: string): Country | undefined {
  return worldCountries.find((c) => c.code === code);
}

// Helper to search countries and cities
export function searchCountries(query: string): Country[] {
  const q = query.toLowerCase();
  return worldCountries.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.currency.toLowerCase().includes(q) ||
      c.cities.some((city) => city.name.toLowerCase().includes(q))
  );
}

export function getCityFromCountry(countryCode: string, cityName: string) {
  const country = getCountry(countryCode);
  return country?.cities.find((c) => c.name.toLowerCase() === cityName.toLowerCase());
}

export function getCurrencySymbol(currencyCode: string): string {
  const found = worldCountries.find(
    (c) => c.currency.toLowerCase() === currencyCode.toLowerCase()
  );
  return found?.symbol || '$';
}
