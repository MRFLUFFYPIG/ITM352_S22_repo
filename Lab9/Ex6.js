function download(url, callback) {
    setTimeout(() => {
        // script to download the picture here
        console.log(`Downloading ${url} ...`);
        picture_data = "image data:XOXOXO";
    }, 3* 1000);
    callback(picture_data); 
}

function process(picture) {
    console.log(`Processing ${picture}`);
}

let url = 'https://www.example.comt/big_pic.jpg';
download(url, process); 

console.log(download(url))