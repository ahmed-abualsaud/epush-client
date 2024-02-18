import { empty } from "./utils"

export const randomString = (length = 8) => {

    let result  = ""
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

    for (let i = 0; i < length; ++i) {
        result += alphabet[Math.floor(alphabet.length * Math.random())]
    }

    return result
  }

export const ucFirst= (str) => {
    return empty(str) ? "" : str.charAt(0).toUpperCase() + str.slice(1)
}

export const snakeToBeautifulCase = (str) => {
    
    return str ? str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '): "NULL"
}

export const kebabToBeautifulCase = (str) => {

  if(empty(str)) return ""
  let words = str.split('-');
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].slice(1);
  }
  return words.join(' ');
}

export const beautifulToSnakeCase = (str) => {

  return str ? str
    .replace(/\s+/g, '_')
    .toLowerCase() : "NULL"
}

export const beautifulToKebabCase = (str) => {
  return str? str.replace(/\s+/g, '-').toLowerCase() : "null"
}

export const encodeString = (string) => {
  return btoa(encodeURIComponent(string))
}

export const splitStringByLength = (str, length) => {
  const substrings = [];
  let startIndex = 0;

  while (startIndex < str.length) {
    let substring = str.substr(startIndex, length);
    const newlineCount = (substring.match(/\r\n|\r|\n/g) || []).length;
    const adjustedLength = length - newlineCount;
    substrings.push(substring.substr(0, adjustedLength));
    startIndex += adjustedLength;
  }

  return substrings;
}

export const countSubstringOccurrences = (string, substring) => {
  const regex = new RegExp(substring, 'g')
  const matches = string.match(regex)
  return matches ? matches.length : 0
}

export const findSimilarWords = (text, blacklist, percentage = 100) => {

  const result = []
  const minWeight = (percentage / 100)

  const words = text.split(/\s+/)
  for (const blacklistedWord of blacklist) {
      for (const word of words) {
          const weight = diceCoefficient(word, blacklistedWord)

          if (weight >= minWeight) {
            result.push({
              textWord: word, 
              blacklistedWord: blacklistedWord, 
              weight: weight
            })
          }
      }
  }

  const doubleWords = splitTextIntoChunks(text, 2)
  for (const blacklistedWord of blacklist) {
    for (const word of doubleWords) {
        const weight = diceCoefficient(word, blacklistedWord)

        if (weight >= minWeight) {
          result.push({
            textWord: word, 
            blacklistedWord: blacklistedWord, 
            weight: weight
          })
        }
    }
  }

//   const tripleWords = splitTextIntoChunks(text, 3)
//   for (const blacklistedWord of blacklist) {
//     for (const word of tripleWords) {
//         const weight = diceCoefficient(word, blacklistedWord)

//         if (weight >= minWeight) {
//           result.push({
//             textWord: word, 
//             blacklistedWord: blacklistedWord, 
//             weight: weight
//           })
//         }
//     }
//   }

  result.sort((a, b) => b.weight - a.weight)
  return result
}

const splitTextIntoChunks = (text, n) => {
  const words = text.split(/\s+/)
  const chunks = []

  for (let i = 0; i < words.length; i += n) {
    const chunk = words.slice(i, i + n).join(' ')
    chunks.push(chunk)
  }

  return chunks
}

export const diceCoefficient = (value, other) => {
	const left = toPairs(value)
	const right = toPairs(other)
	let index = -1
	let intersections = 0
  
	while (++index < left.length) {
	  const leftPair = left[index]
	  let offset = -1
  
	  while (++offset < right.length) {
		const rightPair = right[offset]
  
		if (leftPair === rightPair) {
		  intersections++
  
		  right[offset] = ''
		  break
		}
	  }
	}
  
	return (2 * intersections) / (left.length + right.length)
}
  

const toPairs = (value) => {
	if (Array.isArray(value)) {
	  return value.map((bigram) => normalize(bigram))
	}
  
	const normal = normalize(value)
    return normal.length === 1 ? [normal] : bigram(normal)
  }

  function normalize(value) {
    return String(value).toLowerCase()
}


export const nGram = (n) => {
  if (
    typeof n !== 'number' ||
    Number.isNaN(n) ||
    n < 1 ||
    n === Number.POSITIVE_INFINITY
  ) {
    throw new Error('`' + n + '` is not a valid argument for `n-gram`')
  }

  return grams

  function grams(value) {
    const nGrams = []

    if (value === null || value === undefined) {
      return nGrams
    }

    const source = typeof value.slice === 'function' ? value : String(value)
    let index = source.length - n + 1

    if (index < 1) {
      return nGrams
    }

    while (index--) {
      nGrams[index] = source.slice(index, index + n)
    }

    return nGrams
  }
}

export const bigram = nGram(2)
export const trigram = nGram(3)

export const isValidJSON = (str) => {
	try {
		JSON.parse(str);
		return true;
	} catch (e) {
		return false;
	}
}