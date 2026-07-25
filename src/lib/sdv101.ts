import { getCollection, type CollectionEntry } from 'astro:content';

export type Lesson = CollectionEntry<'sdv101'>;

export const PARTS: { key: string; label: string; blurb: string }[] = [
	{
		key: 'intro',
		label: 'Giới thiệu',
		blurb: 'Khoá học nói về điều gì và dành cho ai.',
	},
	{
		key: 'A',
		label: 'Phần A — Nền tảng',
		blurb: 'SDV là gì, khác gì smartphone, và điều gì khiến phần mềm ô tô đặc biệt.',
	},
	{
		key: 'B',
		label: 'Phần B — Bài học kinh nghiệm',
		blurb: 'Những gì ngành Internet và smartphone đã học được, và phần nào áp dụng cho xe.',
	},
	{
		key: 'C',
		label: 'Phần C — Khối xây dựng',
		blurb: 'Kiến trúc E/E, chuẩn, SOA, vehicle API, OTA và app store trên xe.',
	},
	{
		key: 'D',
		label: 'Phần D — Chiến lược triển khai',
		blurb: 'V-model, software factory, shift left, xe ảo, và các chủ đề cấp doanh nghiệp.',
	},
];

export async function getLessons(): Promise<Lesson[]> {
	const lessons = await getCollection('sdv101');
	return lessons.sort((a, b) => a.data.order - b.data.order);
}

export function groupByPart(lessons: Lesson[]) {
	return PARTS.map((p) => ({
		...p,
		lessons: lessons.filter((l) => l.data.part === p.key),
	})).filter((g) => g.lessons.length > 0);
}
