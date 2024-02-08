export const makeArrayUnique = (array, attribute) => {
    const uniqueValues = {};
  
    const uniqueArray = array?.reduce((result, obj) => {
      const value = obj[attribute];
  
      if (!uniqueValues[value]) {
        uniqueValues[value] = true;
        result.push(obj);
      }
  
      return result;
    }, []);
  
    return uniqueArray;
  }