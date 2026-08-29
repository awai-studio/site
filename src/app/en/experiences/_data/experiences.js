// @/app/en/experiences/_data/experiences.js

export const experiences = [
  {
    slug: "tea-experience-with-soko",
    title: "Private Tea Experience in Kyoto with a Chado Practitioner",
    cardTitle:
      "Beyond Performance — Private Tea Experience in Kyoto with a Chado Practitioner",
    shortDescription:
      "Cultural experiences in Kyoto for small groups, shaped through practice, study, thoughtful discussion, and reflection.",
    cardShortDescription:
      "Cultural experiences in Kyoto for small groups, shaped through practice, study, thoughtful discussion, and reflection.",
    seo: {
      title:
        "Private Tea Experience in Kyoto with a Chado Practitioner | Awai Studio",
      description:
        "A quiet private tea experience in Kyoto centered on tea making, real charcoal, shared study and discussion, and small-group cultural depth.",
    },
    pricing: {
      type: "privateGroup",
      amount: 66000,
      currency: "JPY",
      displayPrice: "¥66,000",
      unit: "per private group",
      minGuests: 1,
      maxGuests: 5,
      stripePriceId: null,
    },
    duration: {
      minutes: 120,
      display:
        "Approximately 2 hours, with time allowed as needed for the experience",
    },
    host: {
      name: "Jack Convery 宗好 Sōkō",
      role: "Canadian-born, Kyoto-based practitioner of Urasenke tea",
      languages: ["English"],
    },
    availability: {
      type: "request",
      weeklyTimeSlots: {
        1: ["10:00", "15:00"],
        2: ["15:00"],
        3: ["15:00"],
        4: ["15:00"],
        5: ["15:00"],
        6: ["10:00", "15:00"],
      },
      specialDateTimeSlots: {},
      // Jack's unavailable Wednesdays and Thursdays are entered here.
      unavailableDates: [
        "2026-09-02",
        "2026-09-03",
        "2026-09-30",
        "2026-10-01",
        "2026-10-28",
        "2026-10-29",
        "2026-11-04",
        "2026-11-05",
      ],
      maxBookingsPerDay: 1,
    },
    cancellation: {
      summary: "Free cancellation up to 7 days before the experience",
      bookingNotice:
        "Please submit your booking request at least 10 days before your preferred date. After we confirm availability, we will send payment details by email. Your booking is confirmed only after payment has been completed.",
      paymentNotice:
        "Please complete payment within 48 hours after we send the payment link. If payment is not completed within this period, your booking request may be cancelled.",
      details: [
        "Cancellations made at least 7 days before the experience are eligible for a full refund.",
        "If your payment is completed less than 7 days before the experience, a full refund is available only for cancellations made within 24 hours after payment.",
        "After this 24-hour period, cancellations made less than 7 days before the experience are non-refundable. Please review this policy carefully before completing your payment.",
        "All deadlines are based on Japan Standard Time.",
        "If Awai Studio needs to cancel the experience for any reason, you will receive a full refund or the option to reschedule.",
      ],
    },
    highlights: [
      "Experience private tea in a quiet Kyoto tea room, away from crowded tourist areas.",
      "Make tea yourself under the guidance of a Kyoto-based practitioner rooted in the Urasenke tradition.",
      "Notice the atmosphere created by real charcoal, sound, fragrance, the glow of candles, and stillness.",
      "Take part in thoughtful conversation on tea, Japanese aesthetics, and cultural sensibilities.",
      "Enjoy a private session designed for presence, attention, and small-group depth.",
    ],
    fullDescription: [
      {
        type: "image",
        src: "/images/experiences/tea-experience-with-jack/260807_G9_7969.jpg",
        alt: "",
      },
      {
        type: "heading",
        text: "Not a Performance, but an Invitation into Tea",
      },
      {
        type: "paragraph",
        text: "This experience is not designed as a presentation of a finished tea performance, not something controlled by schedule or some fixed time. \nIt is a small, private gathering in a quiet tea house in Kyoto, where guests are invited to enter into the very moment of tea itself and share one bowl with a practitioner.",
      },
      {
        type: "paragraph",
        text: "What matters here is not theatrical display, nor a formal explanation of rules and procedures. \nIt is the act of entering into the space, listening carefully, observing the gestures, and taking part in the time that unfolds there. And discovering that there is only space, and something moving in that space. Maybe even, something profound, amazing, and magical happening in that primordially pure space of the four-and-a-half tatami room.",
      },
      {
        type: "paragraph",
        text: "Tea is not only something to be explained. \nWater is heated, charcoal glows, tea is prepared, a bowl of tea is offered to a guest. \nWithin this quiet sequence, there are many things that cannot be fully put into words. There are many things that just might arise from the depths of the human heart.",
      },
      {
        type: "image",
        src: "/images/experiences/tea-experience-with-jack/09_G9_7944.jpg",
        alt: "",
      },
      {
        type: "heading",
        text: "Charcoal, Water, and the Stillness of the Tea House",
      },
      {
        type: "paragraph",
        text: "The gathering takes place in a private tea house in northern Kyoto. \nIt includes a tea garden, a roji path, a preparation room, a waiting area, and a small nijiriguchi entrance leading into a four-and-a-half-tatami tea room. Here, time and space unfold without artifice, naturally and freely.",
      },
      {
        type: "paragraph",
        text: "Real charcoal is used in the hearth, and the water in the kettle begins to sound softly. \nIn tea, the sound of boiling water is sometimes called matsukaze — “the wind in the pines.” \nIt is not merely background sound. It is part of the atmosphere that shapes our time together. It is the primordial sound of Ah! Arising from deep within the kettle, and deep within the human heart.",
      },
      {
        type: "paragraph",
        text: "Before tea is served, guests are invited to observe the movements, listen to the sound, and feel the presence of the room. \nFrom that stillness, words and discoveries arise freely, unobstructed.",
      },
      {
        type: "image",
        src: "/images/experiences/tea-experience-with-jack/description_03_260517_G9_8054.jpg",
        alt: "",
      },
      {
        type: "heading",
        text: "One Bowl of Tea",
      },
      {
        type: "paragraph",
        text: "Chado practice has many forms, gestures, and traditions. \nBut this experience is not centered on the complexity of form itself, but rather on simplicity of feelings",
      },
      {
        type: "paragraph",
        text: "At the heart of the gathering is something very simple: \ntea is prepared with care, one bowl is shared, and each guest is invited to prepare tea directly.",
      },
      {
        type: "paragraph",
        text: "Within that simple exchange we discover attention, care, movement, utensils, relationship, time and space shared between people.",
      },
      {
        type: "paragraph",
        text: "In this experience, tea is not something to watch from a distance. \nGuests are invited to encounter it directly. \nYou may observe, listen, take part in making tea, and speak in your own words about what you notice. Or simply notice your eyes suddenly moist with tears, Or a soft smile on the lips. ",
      },
      {
        type: "image",
        src: "/images/experiences/tea-experience-with-jack/260807_G9_7905.jpg",
        alt: "",
      },
      {
        type: "heading",
        text: "Guided by a Practitioner of Urasenke Tea",
      },
      {
        type: "paragraph",
        text: (
          <>
            The gathering is guided by a Canadian practitioner of Urasenke tea
            whose tea name is Jack Convery <span className="name-jp">宗好</span>{" "}
            Sōkō.
          </>
        ),
      },
      {
        type: "paragraph",
        text: "Tea is not presented here as a title, a performance of status, or a display of knowledge. \nIt is approached as a practice shaped through long repetition, bodily memory, and transmission from teacher to student, from person to person.",
      },
      {
        type: "paragraph",
        text: (
          <>
            His tea name Jack Convery <span className="name-jp">宗好</span> Sōkō
            and his Urasenke background offer one way to understand the depth
            behind this time together.
          </>
        ),
      },
      {
        type: "paragraph",
        text: (
          <>
            Sō<span className="name-jp">（宗）</span>: The ancient lineage of
            Chado. Kō<span className="name-jp">（好）</span>: Good.
          </>
        ),
      },
      {
        type: "paragraph",
        text: "But what matters most in this room is not a title. \nIt is how one meets the bowl in front of them, and how that time is shared. Together with others.",
      },
      {
        type: "image",
        src: "/images/experiences/tea-experience-with-jack/06_G9_7952.jpg",
        alt: "",
      },
      {
        type: "heading",
        text: "Listening, Reflection, and Discovery",
      },
      {
        type: "paragraph",
        text: "This is not a session built only around receiving explanations, but of entering into spontaneous discussions about making tea, the tea room, the utensils, the charcoal, the gestures, about this very moment of now-ness, of light and shadow, of sound and silence.\nBut the deeper value of the experience lies in what each guest notices for themselves.",
      },
      {
        type: "paragraph",
        text: "In the time of tea, listening happens. \nReflection follows. \nAnd sometimes, in a small and quiet way, discovery appears.",
      },
      {
        type: "paragraph",
        text: "It does not need to be dramatic. \nIt may be the sound of the kettle that remains with you. \nIt may be the feeling of holding a tea bowl in your hands. \nIt may be the quiet awareness of preparing tea with care, guided by someone who has practiced tea over many years.",
      },
      {
        type: "paragraph",
        text: "These small discoveries are at the center of this gathering.",
      },
      {
        type: "image",
        src: "/images/experiences/tea-experience-with-jack/04_G9_7942.jpg",
        alt: "",
      },
      {
        type: "heading",
        text: "Beyond the Surface of a Cultural Experience",
      },
      {
        type: "paragraph",
        text: "This is not a quick way to consume something “Japanese.” \nNor is it a strict lesson in correct form.",
      },
      {
        type: "paragraph",
        text: "It is an opportunity to sit in a Kyoto tea house and come into quiet contact with the practice of tea. \nCharcoal, water, a tea bowl, gestures, conversation — each element comes together as part of one shared time.",
      },
      {
        type: "paragraph",
        text: "No prior knowledge of tea is required. \nWhat matters is to slow down, to look carefully, to listen, and to be present.",
      },
      {
        type: "paragraph",
        text: "Tea is not experienced as a culture to be viewed from the outside. \nIt is also a time that arises between people.",
      },
      {
        type: "paragraph",
        text: "We hope this small gathering will remain with you as a quiet and meaningful memory of your time in Kyoto.",
      },
    ],
    included: [
      "Private tea experience for up to 5 guests",
      "Guidance by an English-speaking tea practitioner",
      "An assistant present to support the tea-making practice",
      "Matcha tea and Japanese sweets and Hassun",
      "Hands-on participation in making tea",
      "Use of tea utensils provided for the experience",
    ],
    meetingPoint: {
      description:
        "The experience takes place in a private tea house in northern Kyoto. The exact address and access details will be shared by email after the booking has been confirmed.",
      access: [
        "Approximately 20 minutes on foot from Kinkaku-ji Temple, the Golden Pavilion",
        "Approximately 15 minutes on foot from Daitokuji Temple",
      ],
    },
    importantInformation: [
      "No prior knowledge of tea is required.",
      "Seiza is traditional, but not required.",
      "Please wear comfortable clothing suitable for sitting. This will be your offering of dignity and elegance to our time together.",
      "The experience is conducted in English.",
      "All dates and times are based on Japan Standard Time (JST).",
    ],
    notAllowed: [
      "Please refrain from taking photographs during the experience.",
      "Please refrain from video recording during the experience.",
      "We kindly ask guests to avoid wearing strong fragrances.",
      "We kindly ask guests to remove wristwatches, rings, and other hand accessories during the experience.",
    ],
    bookingHref: "/en/booking?experience=tea-experience-with-soko",
    images: {
      thumbnail:
        "/images/experiences/tea-experience-with-jack/thumbnail_260426_G9_7826.jpg",
      booking:
        "/images/experiences/tea-experience-with-jack/thumbnail_260426_G9_7826.jpg",
    },
    galleryImages: [
      {
        src: "/images/experiences/tea-experience-with-jack/00_G9_7976.jpg",
        alt: "ジャックさん",
      },
      {
        src: "/images/experiences/tea-experience-with-jack/260531_G9_8309.jpg",
        alt: "外観",
      },
      {
        src: "/images/experiences/tea-experience-with-jack/260531_G9_8311.jpg",
        alt: "門1",
      },
      {
        src: "/images/experiences/tea-experience-with-jack/02_G9_7765.jpg",
        alt: "茶室から見た庭",
      },
      {
        src: "/images/experiences/tea-experience-with-jack/260524_G9_8112.jpg",
        alt: "庭と獅子落としと柄杓",
      },
      {
        src: "/images/experiences/tea-experience-with-jack/06_G9_7952.jpg",
        alt: "庭から見た床間",
      },
      {
        src: "/images/experiences/tea-experience-with-jack/260807_G9_7792.jpg",
        alt: "炉に炭を足す手",
      },
      {
        src: "/images/experiences/tea-experience-with-jack/11_G9_7782.jpg",
        alt: "柄杓",
      },
      {
        src: "/images/experiences/tea-experience-with-jack/260807_G9_7802.jpg",
        alt: "茶釜と湯気",
      },
      {
        src: "/images/experiences/tea-experience-with-jack/260524_G9_8092.jpg",
        alt: "床間と蝋燭",
      },
      {
        src: "/images/experiences/tea-experience-with-jack/260524_G9_8229.jpg",
        alt: "鳴り物を叩く手",
      },
      {
        src: "/images/experiences/tea-experience-with-jack/15_1011457.jpg",
        alt: "茶釜と炭、炉",
      },
    ],
  },
  {
    slug: "zen-experience-with-jirai",
    title: "Kyoto: Zen and Dialogue with a German-Born Zen Priest",
    cardTitle: "Zen and Dialogue with a German-Born Zen Priest",
    shortDescription:
      "A zazen and dialogue experience at a quiet local temple in western Kyoto, guided by a German-born Zen priest.",
    cardShortDescription:
      "Sit in zazen and share dialogue with a German-born Zen priest at a quiet local temple in western Kyoto.",
    seo: {
      title:
        "Kyoto Zen and Dialogue with a German-Born Zen Priest | Awai Studio",
      description:
        "A zazen and dialogue experience at a quiet local temple in western Kyoto, guided by a German-born Zen priest. Reflect on your time in Japan through Zen practice and conversation.",
    },
    pricing: {
      type: "perPerson",
      amount: 16000,
      currency: "JPY",
      displayPrice: "¥16,000",
      unit: "per guest",
      minGuests: 3,
      maxGuests: 9,
      stripePriceId: null,
    },
    duration: {
      minutes: 90,
      display: "Approximately 90 minutes",
    },
    host: {
      name: "Mehl Jirai",
      role: "Kyoto-based Zen priest",
      languages: ["English", "German"],
    },
    availability: {
      type: "request",
      weeklyTimeSlots: {
        2: ["09:00", "15:00"],
        3: ["09:00", "15:00"],
        4: ["09:00", "15:00"],
        5: ["09:00", "15:00"],
        6: ["09:00", "15:00"],
      },
      specialDateTimeSlots: {},
      unavailableDates: [],
      maxBookingsPerDay: 1,
    },
    cancellation: {
      summary: "Free cancellation up to 7 days before the experience",
      bookingNotice:
        "Please submit your booking request at least 10 days before your preferred date. After we confirm availability, we will send payment details by email. Your booking is confirmed only after payment has been completed.",
      paymentNotice:
        "Please complete payment within 48 hours after we send the payment link. If payment is not completed within this period, your booking request may be cancelled.",
      details: [
        "Cancellations made at least 7 days before the experience are eligible for a full refund.",
        "If your payment is completed less than 7 days before the experience, a full refund is available only for cancellations made within 24 hours after payment.",
        "After this 24-hour period, cancellations made less than 7 days before the experience are non-refundable. Please review this policy carefully before completing your payment.",
        "All deadlines are based on Japan Standard Time.",
        "If Awai Studio needs to cancel the experience for any reason, you will receive a full refund or the option to reschedule.",
      ],
    },
    highlights: [
      "Practice zazen and share dialogue at a quiet local temple in western Kyoto.",
      "Pair this quiet Zen experience at a local temple with a visit to Katsura Imperial Villa, one of Kyoto’s most refined cultural sites in the western part of the city.",
      "Be guided by Jirai, a German-born Zen priest who speaks English and German.",
      "Visit Fukujoji Temple, a quiet temple in western Kyoto with over 1,240 years of history.",
      "Sit quietly, become aware of your breath, and shift your mind away from the pace of everyday life.",
    ],
    fullDescription: [
      {
        type: "image",
        src: "/images/experiences/zen-experience-with-jirai/260531_G9_8268.jpg",
        alt: "",
      },
      {
        type: "heading",
        text: "Zazen and Dialogue at a Quiet Temple in Kyoto",
      },
      {
        type: "paragraph",
        text: "This experience is centered on zazen and dialogue at a quiet local temple in western Kyoto.",
      },
      {
        type: "paragraph",
        text: "It is not designed as a performance of Zen, nor as a mystical promise. Instead, it offers a simple and direct time to sit, breathe, and speak with a Zen priest in the setting of a local temple.",
      },
      {
        type: "paragraph",
        text: "The session begins with zazen. After sitting, guests are invited to share questions and reflections over matcha in a relaxed conversation with Jirai.",
      },
      {
        type: "image",
        src: "/images/experiences/zen-experience-with-jirai/260531_G9_8263.jpg",
        alt: "",
      },
      {
        type: "heading",
        text: "Before or After Katsura Imperial Villa",
      },
      {
        type: "paragraph",
        text: "This experience is easy to pair with a reserved visit to Katsura Imperial Villa. Before or after your visit, you can spend time at a local temple, sitting quietly, becoming aware of your breath, and reflecting on what you have felt.",
      },
      {
        type: "paragraph",
        text: "Katsura Imperial Villa is one of Kyoto’s most refined cultural sites, known for its architecture, gardens, and Japanese aesthetics. Zazen and dialogue with the resident priest at Fukujoji Temple may offer a quiet time to take in more deeply what you felt there.",
      },
      {
        type: "image",
        src: "/images/experiences/zen-experience-with-jirai/260531_G9_8293.jpg",
        alt: "",
      },
      {
        type: "heading",
        text: "A Temple as a Place to Shift the Mind",
      },
      {
        type: "paragraph",
        text: "For Jirai, a temple is a place where people can shift their state of mind.",
      },
      {
        type: "paragraph",
        text: "You look at the garden. You notice the scenery. You sit in zazen. You speak with the priest. Each of these moments is part of what a temple can offer.",
      },
      {
        type: "paragraph",
        text: "Rather than approaching Zen first as an abstract idea, this experience begins with something more immediate: posture, breath, stillness, and the feeling of being present in a temple space.",
      },
      {
        type: "image",
        src: "/images/experiences/zen-experience-with-jirai/260531_G9_8273.jpg",
        alt: "",
      },
      {
        type: "heading",
        text: "Fukujoji Temple and Its Surroundings",
      },
      {
        type: "paragraph",
        text: "The experience takes place at Fukujoji Temple, a historic temple in western Kyoto with over 1,240 years of history.",
      },
      {
        type: "paragraph",
        text: "The temple grounds include a garden, temple halls, bamboo, and seasonal scenery. Depending on the season, guests may encounter flowers, autumn leaves, or the quiet atmosphere of the temple grounds.",
      },
      {
        type: "paragraph",
        text: "This is not a crowded sightseeing spot. It is a place where the surrounding space, the garden, and the quietness of the temple all become part of the experience.",
      },
      {
        type: "image",
        src: "/images/experiences/zen-experience-with-jirai/260711_G9_8915.jpg",
        alt: "",
      },
      {
        type: "heading",
        text: "Guided by Jirai, a German-Born Zen Priest",
      },
      {
        type: "paragraph",
        text: "The experience is guided by Jirai Mehl, a German-born Zen priest and the resident priest of Fukujoji Temple.",
      },
      {
        type: "paragraph",
        text: "Jirai came to Japan in 2001 and has been responsible for Fukujoji Temple since 2013. Today, he serves as the temple’s resident priest.",
      },
      {
        type: "paragraph",
        text: "Before coming to Japan, he worked in the medical field in Germany, studied psychology, and worked in psychiatric care as a therapist. This background shapes the way he listens and responds to guests during conversation.",
      },
      {
        type: "paragraph",
        text: "The session can be conducted in English or German.",
      },
      {
        type: "image",
        src: "/images/experiences/zen-experience-with-jirai/260711_G9_8903.jpg",
        alt: "",
      },
      {
        type: "heading",
        text: "Not Enlightenment, but Noticing Yourself",
      },
      {
        type: "paragraph",
        text: "This experience does not use Zen to promise enlightenment, healing, or a special spiritual awakening.",
      },
      {
        type: "paragraph",
        text: "For Jirai, the first step of zazen is much simpler: become aware of your breath, sit quietly, and begin to notice yourself.",
      },
      {
        type: "paragraph",
        text: "As the mind becomes quieter, there may be a small shift. You may notice your thoughts, your body, your breathing, or the way you have been moving through your days.",
      },
      {
        type: "paragraph",
        text: "Nothing dramatic needs to happen. The value of the experience lies in taking time to sit, breathe, and return to yourself in the quiet setting of a Kyoto temple.",
      },
    ],
    included: [
      "Small-group Zen experience at Fukujoji Temple",
      "Guidance by an English- or German-speaking Zen priest",
      "Zazen practice at a quiet local temple rooted in everyday Kyoto",
      "Dialogue and questions with Jirai after zazen",
      "Matcha prepared by Jirai during the conversation",
    ],
    meetingPoint: {
      description:
        "The meeting point is near the west exit of Hankyu Katsura Station. The detailed meeting point and temple address will be shared by email when we confirm availability for your requested date.",
      access: [
        "About 7 minutes by taxi from Hankyu Katsura Station, depending on traffic.",
        "Hankyu Katsura Station is served by the Hankyu Kyoto Line and Hankyu Arashiyama Line.",
      ],
    },
    importantInformation: [
      "No prior knowledge of Zen or zazen is required.",
      "Please wear comfortable clothing suitable for sitting.",
      "Please refrain from taking photographs during zazen.",
      "The matcha is offered as part of the conversation, not as a formal tea ceremony.",
      "The experience is conducted in English or German.",
      "The meeting point is near the west exit of Hankyu Katsura Station. The detailed meeting point and the temple address will be shared by email when we confirm availability for your requested date.",
      "All dates and times are based on Japan Standard Time (JST).",
    ],
    notAllowed: [
      "Please refrain from taking photographs during zazen.",
      "Please refrain from video recording during zazen.",
      "We kindly ask guests to avoid wearing strong perfumes or fragrances.",
    ],
    bookingHref: "/en/booking?experience=zen-experience-with-jirai",
    images: {
      thumbnail:
        "/images/experiences/zen-experience-with-jirai/260711_G9_8984.jpg",
      booking:
        "/images/experiences/zen-experience-with-jirai/260711_G9_8984.jpg",
      description: [
        "/images/experiences/zen-experience-with-jirai/description_01.jpg",
        "/images/experiences/zen-experience-with-jirai/description_02.jpg",
        "/images/experiences/zen-experience-with-jirai/description_03.jpg",
      ],
    },
    galleryImages: [
      {
        src: "/images/experiences/zen-experience-with-jirai/this_G9_8921.jpg",
        alt: "座禅をする慈頼住職",
      },
      // {
      //   src: "/images/experiences/zen-experience-with-jirai/260711_G9_8936.jpg",
      //   alt: "座禅をする慈頼住職",
      // },
      {
        src: "/images/experiences/zen-experience-with-jirai/260531_G9_8257.jpg",
        alt: "竹林1",
      },
      {
        src: "/images/experiences/zen-experience-with-jirai/this_G9_8854.jpg",
        alt: "蓮",
      },
      // {
      //   src: "/images/experiences/zen-experience-with-jirai/260531_G9_8254.jpg",
      //   alt: "門を引きで",
      // },
      {
        src: "/images/experiences/zen-experience-with-jirai/260711_G9_8868.jpg",
        alt: "窓越しの本堂内",
      },
      {
        src: "/images/experiences/zen-experience-with-jirai/260711_G9_8958.jpg",
        alt: "読経をする慈頼住職",
      },
      {
        src: "/images/experiences/zen-experience-with-jirai/260531_G9_8283.jpg",
        alt: "仏像の手",
      },
      {
        src: "/images/experiences/zen-experience-with-jirai/260531_G9_8253.jpg",
        alt: "全景",
      },
    ],
  },
];
