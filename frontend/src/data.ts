import { ITask } from "types";

export const tasks: ITask[] = [
  {
    id: 1,
    title: "Sometimes life is scary and dark",
    description: "Sometimes life is scary and dark",
    column: 1
  },
  {
    id: 2,
    title:
      "Sucking at something is the first step towards being sorta good at something.",
    description:
      "Sucking at something is the first step towards being sorta good at something.",
    column: 2
  },
  {
    id: 3,
    title: "You got to focus on what's real, man",
    description: "You got to focus on what's real, man",
    column: 2
  },
  {
    id: 4,
    title: "Is that where creativity comes from? From sad biz?",
    description: "Is that where creativity comes from? From sad biz?",

    column: 3
  },
  {
    id: 5,
    title: "Homies help homies. Always",
    description: "Homies help homies. Always",
    column: 3
  },
  {
    id: 6,
    title: "Responsibility demands sacrifice",
    description: "Responsibility demands sacrifice",
    column: 4
  },
  {
    id: 7,
    title: "That's it! The answer was so simple, I was too smart to see it!",
    description:
      "That's it! The answer was so simple, I was too smart to see it!",
    column: 4
  },
  {
    id: 8,
    title:
      "People make mistakes. It's all a part of growing up and you never really stop growing",
    description:
      "People make mistakes. It's all a part of growing up and you never really stop growing",
    column: 5
  },
  {
    id: 9,
    title: "Don't you always call sweatpants 'give up on life pants,' Jake?",
    description:
      "Don't you always call sweatpants 'give up on life pants,' Jake?",
    column: 5
  },
  {
    id: 10,
    title: "I should not have drunk that much tea!",
    description: "I should not have drunk that much tea!",
    column: 6
  },
  {
    id: 11,
    title: "Please! I need the real you!",
    description: "Please! I need the real you!",
    column: 6
  },
  {
    id: 12,
    title: "Haven't slept for a solid 83 hours, but, yeah, I'm good.",
    description: "Haven't slept for a solid 83 hours, but, yeah, I'm good.",
    column: 6
  }
];

// So we do not have any clashes with our hardcoded ones
let idCount: number = tasks.length + 1;

export const getTasks = (count: number): ITask[] =>
  Array.from({ length: count }, (v, k) => k).map(() => {
    const random: ITask = tasks[Math.floor(Math.random() * tasks.length)];

    const custom: ITask = {
      ...random,
      id: idCount++
    };

    return custom;
  });
