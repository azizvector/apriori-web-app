// Given a dataset and a minimum support threshold, generate all frequent itemsets
export function generateFrequentItemsets(dataset: any, minSupport: any) {
  // Get all unique items in the dataset
  let uniqueItems: any = new Set();
  for (let i = 0; i < dataset.length; i++) {
    let transaction = dataset[i];
    for (let j = 0; j < transaction.length; j++) {
      let item = transaction[j];
      uniqueItems.add(item);
    }
  }

  // Initialize frequent itemsets
  let frequentItemsets: any[] = [];

  // Generate frequent itemsets of length 1
  let frequentItemsetsLength1 = [];
  for (let item of uniqueItems) {
    let support = calculateSupportPercentage(dataset, [item]);
    if (support >= minSupport) {
      frequentItemsetsLength1.push([item]);
    }
  }
  // console.log("frequentItemsetsLength1", frequentItemsetsLength1);
  frequentItemsets = frequentItemsets.concat(frequentItemsetsLength1);

  // Generate frequent itemsets of length > 1
  let k = 2;
  let lastFrequentItemsets = frequentItemsetsLength1;
  while (lastFrequentItemsets.length > 0) {
    let candidateItemsets = [];
    for (let i = 0; i < lastFrequentItemsets.length; i++) {
      for (let j = i + 1; j < lastFrequentItemsets.length; j++) {
        let itemset1 = lastFrequentItemsets[i];
        let itemset2 = lastFrequentItemsets[j];
        // console.log('itemset1', itemset1);
        // console.log('itemset2', itemset2);
        // console.log('itemset1.slice(0, k - 2).every((v, i) => v', itemset1.slice(0, k - 2).every((v, i) => v));
        if (itemset1.slice(0, k - 2).every((v, i) => v === itemset2[i])) {
          candidateItemsets.push(itemset1.concat(itemset2[k - 2]));
        }
      }
    }
    let frequentItemsetsK = [];
    for (let candidate of candidateItemsets) {
      let support = calculateSupportPercentage(dataset, candidate);
      if (support >= minSupport) {
        frequentItemsetsK.push(candidate);
      }
    }
    frequentItemsets = frequentItemsets.concat(frequentItemsetsK);
    lastFrequentItemsets = frequentItemsetsK;
    k++;
  }

  return frequentItemsets;
}

// Given a dataset and a candidate itemset, calculate the support as a percentage
export function calculateSupportPercentage(dataset: any, candidate: any) {
  let count = 0;
  for (let i = 0; i < dataset.length; i++) {
    let transaction = dataset[i];
    let isSubset = true;
    for (let j = 0; j < candidate.length; j++) {
      let item = candidate[j];
      if (!transaction.includes(item)) {
        isSubset = false;
        break;
      }
    }
    if (isSubset) {
      count++;
    }
  }
  return (count / dataset.length) * 100;
}

export function generateAssociationRules(dataset: any, itemset: any, frequentItemsets: any, minConfidence: any) {
  let rules: any = [];

  // Generate all possible non-empty proper subsets of the itemset
  for (let i = 1; i < itemset.length; i++) {
    let subsets = getSubsets(itemset, i);

    // For each subset, check if the rule satisfies the minimum confidence threshold
    for (let antecedent of subsets) {
      let consequent = itemset.filter((item: any) => !antecedent.includes(item));
      let confidence = calculateConfidence(dataset, antecedent, consequent, frequentItemsets);
      if (confidence >= minConfidence) {
        rules.push({ antecedent, consequent, confidence });
      }
    }
  }

  return rules;
}

export function getSubsets(itemset: any, k: any) {
  if (k === 1) {
    return itemset.map((item: any) => [item]);
  }

  let subsets = [];

  for (let i = 0; i <= itemset.length - k; i++) {
    let prefix = itemset.slice(i, i + 1);
    let suffixes: any = getSubsets(itemset.slice(i + 1), k - 1);
    for (let suffix of suffixes) {
      subsets.push(prefix.concat(suffix));
    }
  }

  return subsets;
}

export function calculateConfidence(dataset: any, antecedent: any, consequent: any, frequentItemsets: any) {
  let supportA = calculateSupport(dataset, antecedent);
  let supportAB = calculateSupport(dataset, antecedent.concat(consequent));
  return Math.round((supportAB / supportA + Number.EPSILON) * 100) / 100;
}

export function calculateSupport(dataset: any, itemset: any) {
  let count = 0;
  for (let transaction of dataset) {
    if (itemset.every((item: any) => transaction.includes(item))) {
      count++;
    }
  }
  return count;
}

export const twoDecimalPlacesWithoutRound = (num: number): number => {
  if (num % 1 === 0) {
      return num;
  }
  const stringNum = num.toString();
  let finalNum = stringNum.slice(0, stringNum.indexOf('.') + 3);
  
  return Number(finalNum);
};