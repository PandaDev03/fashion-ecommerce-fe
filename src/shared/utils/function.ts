import { FileType } from '../components/Upload/Dragger';
import { DEFAULT_URL_FIELDS } from './constants';

export const generateSlug = (name: string) => {
  if (!name) return undefined;

  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const removeUrlPrefix = <T extends Record<string, any>>(data: T) => {
  const cleanedUrl = Object.entries(data).reduce((prev, current) => {
    const [key, value] = current;

    prev[key] =
      typeof value === 'string' ? value.replace(/^(https?:\/\/)/, '') : value;

    return prev;
  }, {} as Record<string, any>);

  return cleanedUrl;
};

export const normalizeUrlWithHttps = (url: string | undefined): string | undefined => {
  if (!url || url.trim() === '') return undefined;

  const trimmedUrl = url.trim();

  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://'))
    return trimmedUrl;

  return `https://${trimmedUrl}`;
};

export const normalizeObjectStrings = <T extends Record<string, any>>(
  data: T,
  urlFields: string[] = DEFAULT_URL_FIELDS
): T => {
  const normalizedObj = Object.entries(data).reduce((prev, current) => {
    const [key, value] = current;

    if (typeof value === 'string') {
      const trimmedValue = value?.trim();

      if (urlFields?.includes(key))
        prev[key] = normalizeUrlWithHttps(trimmedValue);
      else prev[key] = trimmedValue;
    } else prev[key] = value;

    return prev;
  }, {} as Record<string, any>);

  return normalizedObj as T;
};
