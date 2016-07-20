
var http=require("http");
var express=require("express");
var fs=require("fs");
var mysql=require("mysql");
var bodyParser=require("body-parser");
var ejs=require("ejs");

var serv=express(); //express모듈 생성

serv.use(bodyParser.json());
serv.use(bodyParser.urlencoded({extended:true}));

var client = mysql.createConnection({ //Maria DB 접속
	"url":"localhost",
	"user":"root",
	"password":""
});

client.query("use board"); //board DB접속

//회원등록 페이지 요청시 동작.
serv.route("/regist_form").get(function(request, response){
	var data = fs.readFileSync("./regist_form.html","utf8");
	response.writeHead(200,{"Content-Type":"text/html; charset=utf8"});
	response.end(data);
}); 

//회원등록
serv.route("/regist").post(function(request, response){
	var addMem = fs.readFileSync("./regist_form.html","utf8"); //디렉토리내의 회원가입에대한 파일을 읽어옴
	var member = request.body;
	
	var id=member.id;
	var pwd=member.pwd;
	var repwd=member.repwd;
	client.query("insert into member(id,pwd,repwd) values('"+id+"','"+pwd+"','"+repwd+"')",function(error,records){
		if(!error){
			console.log("등록성공");
			response.redirect("/login_from"); //회원가입 완료시 로그인페이지이동.
		}else{
			console.log("Connection error");
		}
	});		
});


//로그인 페이지 요청시 동작.
serv.route("/login_form").get(function(request, response){
	var data = fs.readFileSync("./login_form.html","utf8");
	response.writeHead(200,{"Content-Type":"text/html; charset=utf8"});
	response.end(data);
}); 

//로그인
serv.route("/login").post(function(request, response){
	var addMem = fs.readFileSync("./login_form.html","utf8"); //디렉토리내의 회원가입에대한 파일을 읽어옴
	
	var member = request.body;
	var id=member.id;
	var pwd=member.pwd;

	client.query("select * from member where id="+id+" ,pwd='"+pwd+"'",function(error,records){
		if(!error){
			console.log("등록성공");
			response.redirect("/list"); //로그인 성공시 글목록으로 넘어감
		}else{
			console.log("Connection error");
		}
	});		
});

//글쓰기

//글목록

//글삭제

//서버시작
var board = http.createServer(serv);
board.listen(8583,function(){
	console.log("Server is running at 8583");
});