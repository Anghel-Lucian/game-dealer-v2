export const AJAX = async function (url) {
  try {
    const data = await axios.get(url);

    if (data.status !== 200)
      throw new Error(
        `Fetching failed. Check AJAX() in helpers.js (${data.status})`
      );

    const res = data.data;

    if (res.length === 0)
      throw new Error(`There is no data. Check AJAX() in helpers.js`);

    return res;
  } catch (err) {
    console.log('---CATCHED---', err);
    return err;
  }
};

export const filterCharacters = function (string) {
  let modified = [];
  string.split(' ').forEach(stringEl => {
    modified.push(
      stringEl
        .split('')
        .filter(char => char.match(/^[a-zA-Z0-9]+$/))
        .join('')
    );
  });

  return modified.join('-');
};
