function spinWords(str){
	//TODO Have fun :)
	var res = [];
	str.split(" ").forEach((item) => {
		res.push(item.length >= 5 ? item.split("").reverse().join("") : item);
	});
	return res.join(" ");
}
spinWords("Hey fellow warriors");