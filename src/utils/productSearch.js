const STOP_WORDS = new Set(['a', 'an', 'and', 'for', 'i', 'in', 'is', 'it', 'me', 'of', 'on', 'or', 'the', 'to', 'want', 'what', 'with']);

const SYNONYMS = {
  apparel: ['apparel', 'clothing', 'fashion', 'dress', 'kurti', 'shirt', 'jacket'],
  clothes: ['clothes', 'clothing', 'fashion', 'dress', 'kurti', 'shirt', 'jacket'],
  clothing: ['clothing', 'clothes', 'fashion', 'dress', 'kurti', 'shirt', 'jacket'],
  dress: ['dress', 'kurti', 'ethnic'],
  dresses: ['dresses', 'dress', 'kurti', 'ethnic'],
  phone: ['phone', 'mobile', 'iphone', 'smartphone'],
  phones: ['phones', 'phone', 'mobile', 'iphone', 'smartphone'],
  mobile: ['mobile', 'phone', 'iphone', 'smartphone'],
  mobiles: ['mobiles', 'mobile', 'phone', 'smartphone'],
  sneaker: ['sneaker', 'sneakers', 'shoes'],
  sneakers: ['sneakers', 'sneaker', 'shoes'],
  shoe: ['shoe', 'shoes', 'sneaker'],
  shoes: ['shoes', 'shoe', 'sneaker', 'sneakers'],
};

function normalize(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function editDistanceAtMostOne(left, right) {
  if (left === right) return true;
  if (Math.abs(left.length - right.length) > 1) return false;

  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < left.length && j < right.length) {
    if (left[i] === right[j]) {
      i += 1;
      j += 1;
    } else {
      edits += 1;
      if (edits > 1) return false;
      if (left.length > right.length) i += 1;
      else if (right.length > left.length) j += 1;
      else { i += 1; j += 1; }
    }
  }
  if (i < left.length || j < right.length) edits += 1;
  return edits <= 1;
}

function tokenMatches(queryToken, productToken) {
  const variants = SYNONYMS[queryToken] || [queryToken];
  return variants.some((variant) => {
    if (productToken === variant || productToken.startsWith(variant) || variant.startsWith(productToken)) return true;
    return variant.length >= 5 && productToken.length >= 5 && editDistanceAtMostOne(variant, productToken);
  });
}

export function searchProducts(query, productList) {
  const queryTokens = normalize(query).split(/\s+/).filter((token) => token && !STOP_WORDS.has(token));
  if (queryTokens.length === 0) return [];

  return productList
    .map((product) => {
      const titleTokens = normalize(product.title).split(' ');
      const brandTokens = normalize(product.brand).split(' ');
      const categoryTokens = normalize(product.category).split(' ');
      const allTokens = normalize([
        product.title,
        product.brand,
        product.category,
        product.description,
        ...(product.highlights || []),
        ...(product.colors || []),
        ...(product.sizes || []),
      ].join(' ')).split(' ');
      let score = 0;

      for (const queryToken of queryTokens) {
        const titleMatch = titleTokens.some((token) => tokenMatches(queryToken, token));
        const brandMatch = brandTokens.some((token) => tokenMatches(queryToken, token));
        const categoryMatch = categoryTokens.some((token) => tokenMatches(queryToken, token));
        const anyMatch = allTokens.some((token) => tokenMatches(queryToken, token));
        if (!anyMatch) return { product, score: -1 };
        score += titleMatch ? 10 : brandMatch ? 8 : categoryMatch ? 6 : 2;
      }

      return { product, score };
    })
    .filter((result) => result.score >= 0)
    .sort((a, b) => b.score - a.score || Number(b.product.featured) - Number(a.product.featured))
    .map((result) => result.product);
}
