



const myChildren = [
  {
    id: 1,
    name: "أحمد",
    age: 12,
    imageUri: require("@/assets/images/childs/1.jpg"),
    analysis: {
      progress: 0.6,
      talaqin: 0.8,
      hifz: 0.5,
      review: 0.7,
    },
    advices: [
      "خصص وقتاً يومياً لمراجعة ما تم حفظه",
      "استمع للقرآن قبل النوم.",
      "تعلم واستمتع بتجويد الآيات",
    ],
  },
  {
    id: 2,
    name: "ريم",
    age: 10,
    imageUri: require("@/assets/images/childs/2.jpg"),
    analysis: {
      progress: 0.4,
      talaqin: 0.7,
      hifz: 0.4,
      review: 0.2,
    },
    advices: [
      "استخدم تقنيات الحفظ البصرية كالبطاقات التعليمية.",
      "شارك في مسابقات الحفظ لتحفيز الذات",
      "حافظ على روتين ثابت في الحفظ",
    ],
  },
  {
    id: 3,
    name: "عبدالرحمن",
    age: 8,
    imageUri: require("@/assets/images/childs/3.jpg"),
    analysis: {
      progress: 0.2,
      talaqin: 0.3,
      hifz: 0.5,
      review: 0.4,
    },
    advices: [
      "حفظ القرآن مع الأصدقاء لزيادة الحماس",
      "استخدام التسجيلات الصوتية لتحسين النطق",
      "تعلم القصص وراء السور لزيادة الاهتمام والحفظ.",
    ],
  },
];


export default myChildren
