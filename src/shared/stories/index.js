// HSK 1 Level Chinese Stories
const HSK1_STORIES = [
  {
    id: "story_001",
    title: "我的一天",
    level: "HSK1",
    wordCount: 65,
    readTime: 1,
    content: `我叫小明。我是学生。
    
今天是星期一。我早上七点起床。我吃早饭，然后去学校。

在学校，我学习中文。老师很好。我们学习汉字。我有很多同学。他们都很友好。

中午我在学校吃午饭。午饭很好吃。下午我们学习数学。

晚上我回家。我吃晚饭，看电视。九点我睡觉。

今天很开心！`,
    createdAt: "2025-01-15T00:00:00Z",
    category: "dailyLife"
  },
  
  {
    id: "story_002", 
    title: "我的家",
    level: "HSK1",
    wordCount: 58,
    readTime: 1,
    content: `这是我的家。我家有四个人：爸爸、妈妈、弟弟和我。

我家不大，但是很漂亮。我们有客厅、厨房和两个卧室。

爸爸在客厅看电视。妈妈在厨房做饭。弟弟在卧室学习。我喜欢在我的房间看书。

晚上我们一起吃晚饭。我们很开心。

我爱我的家！`,
    createdAt: "2025-01-14T00:00:00Z",
    category: "family"
  },

  {
    id: "story_003",
    title: "买水果", 
    level: "HSK1",
    wordCount: 52,
    readTime: 1,
    content: `今天我和妈妈去买水果。

水果店有很多水果：苹果、香蕉、橙子、葡萄。

妈妈问："你想要什么水果？"

我说："我想要苹果和香蕉。"

苹果很红，很好看。香蕉很黄，很甜。

老板说："苹果十块钱一斤，香蕉八块钱一斤。"

妈妈买了两斤苹果和一斤香蕉。

我们付钱，然后回家。水果很好吃！`,
    createdAt: "2025-01-13T00:00:00Z", 
    category: "shopping"
  },

  {
    id: "story_004",
    title: "在餐厅",
    level: "HSK1", 
    wordCount: 46,
    readTime: 1,
    content: `今天中午我和朋友去餐厅吃饭。

服务员说："你们好！请坐。"

我们坐下。服务员给我们菜单。

朋友问我："你想吃什么？"

我说："我想吃米饭和鱼。你呢？"

朋友说："我想吃面条和鸡肉。"

我们点菜。菜很快就来了。

米饭很香，鱼很好吃。面条也很好。

我们吃得很开心！`,
    createdAt: "2025-01-12T00:00:00Z",
    category: "food" 
  },

  {
    id: "story_005",
    title: "坐公交车",
    level: "HSK1",
    wordCount: 54,
    readTime: 1, 
    content: `今天我要去图书馆。我坐公交车去。

我在公交车站等车。很多人也在等车。

公交车来了。车很大，是红色的。

我上车，给司机两块钱。司机很友好。

车上有很多人。有学生，有老人，有小孩。

我找到一个座位坐下。窗外的风景很漂亮。

十分钟后，我到了图书馆。我下车，说："谢谢！"

坐公交车很方便！`,
    createdAt: "2025-01-11T00:00:00Z",
    category: "transportation"
  },

  {
    id: "story_006", 
    title: "学习中文",
    level: "HSK1",
    wordCount: 48,
    readTime: 1,
    content: `我是外国学生。我在中国学习中文。

中文很有趣，但是也很难。汉字很漂亮。

老师教我们说话、读书、写字。老师很有耐心。

我每天学习新单词。我用书、电脑和手机学习。

同学们都很好。我们一起练习说中文。

现在我会说一些中文了。我很高兴！

我要继续学习中文。`,
    createdAt: "2025-01-10T00:00:00Z",
    category: "education"
  },

  {
    id: "story_007",
    title: "看医生", 
    level: "HSK1",
    wordCount: 44,
    readTime: 1,
    content: `今天我不舒服。我头痛，也发烧。

妈妈说："我们去医院看医生。"

在医院，我们等了很长时间。

医生问我："你哪里不舒服？"

我说："我头痛，还发烧。"

医生给我检查。他说："你感冒了。"

医生给我开药。他说："你要多喝水，多休息。"

我谢谢医生。

现在我好多了！`,
    createdAt: "2025-01-09T00:00:00Z",
    category: "health"
  },

  {
    id: "story_008",
    title: "周末计划",
    level: "HSK1", 
    wordCount: 50,
    readTime: 1,
    content: `明天是周末。我很开心！

星期六上午我要去公园。公园很大，很漂亮。我喜欢在那里走路。

下午我要去书店买书。我想买一本中文书。

晚上我要和朋友看电影。电影院离我家很近。

星期天我要在家休息。我想睡觉，看电视。

我也要做作业。老师给我们很多作业。

周末很好！我可以放松！`,
    createdAt: "2025-01-08T00:00:00Z",
    category: "leisure"
  }
];

const getStoriesByLevel = (level) => {
  return HSK1_STORIES.filter(story => story.level === level);
};

const getStoryById = (id) => {
  return HSK1_STORIES.find(story => story.id === id);
};

const getAllStories = () => {
  return HSK1_STORIES;
};

const getStoriesByCategory = (category) => {
  return HSK1_STORIES.filter(story => story.category === category);
};

const getAvailableCategories = () => {
  const categories = [...new Set(HSK1_STORIES.map(story => story.category))];
  return categories;
};

const getAvailableLevels = () => {
  const levels = [...new Set(HSK1_STORIES.map(story => story.level))];
  return levels;
};

module.exports = {
  HSK1_STORIES,
  getStoriesByLevel,
  getStoryById,
  getAllStories,
  getStoriesByCategory,
  getAvailableCategories,
  getAvailableLevels
};