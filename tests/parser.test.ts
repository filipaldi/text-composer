import { parseDocument, replaceLinks } from '../src/parser';

test('parseDocument should identify links', () => {
    const content = 'Lorem ipsum... ![[link_to_document]] ...dolor sit amed..';
    const result = parseDocument(content);
    expect(result.links).toEqual(['link_to_document']);
});

test('replaceLinks should replace link with content', () => {
    const content = 'Lorem ipsum... ![[link_to_document]] ...dolor sit amed..';
    const result = replaceLinks(content, 'link_to_document', 'nested content');
    expect(result).toBe('Lorem ipsum... nested content ...dolor sit amed..');
});
