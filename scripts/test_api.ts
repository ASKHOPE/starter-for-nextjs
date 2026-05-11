async function test() {
    const res = await fetch('https://openscriptureapi.org/api/scriptures/v1/lds/en/book-of-mormon/1-nephi/1');
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2).substring(0, 500));
}
test();
