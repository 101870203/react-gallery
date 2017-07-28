'use strict'
import React from 'react';
import './style.css';

// 获取图片相关的数据
var imageDatas = require('../data/imageDatas.json');

// 利用自执行函数，将图片名信息转换成图片URL路径信息
imageDatas = (function genImageURL(imageDatasArr) {
	for(var i=0;i<imageDatasArr.length;i++) {
		var singleImaageData = imageDatasArr[i];
		singleImaageData.imageURL = require('../images/'+singleImaageData.fileName);
		imageDatasArr[i] = singleImaageData;
	}
	return imageDatasArr;
})(imageDatas);


//单副画组件
const ImgFigure = () => {
	return (
		<figure>
			<img/>
			<figcaption>
				<h2></h2>
			</figcaption>
		</figure>
	)
}
class App extends React.Component {
	constructor() {
		super();
	}
	render() {
		var controllerUnits = [],
			imgFigures = [];
		imageDatas.forEach(function(value) {
			imgFigures.push(<ImgFigure data={value}/>);
		})
		return (
			<section className="stage">
				<section className="img-sec">{imgFigures}</section>
				<nav className="controller-nav">{controllerUnits}</nav>
			</section>
        );
	}
}
export default App;
