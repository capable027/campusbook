/** 教材成色选项（展示与筛选） */
export const BOOK_CONDITIONS = ["全新", "九成新", "八成新", "七成新", "有笔记/划线"] as const;

export type BookCondition = (typeof BOOK_CONDITIONS)[number];
