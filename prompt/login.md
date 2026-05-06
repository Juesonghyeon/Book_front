## 1. 상태 관리
- 상태관리는 zustand 를 이용
- 새로고침 저장을 위해 presist 이용
- 문법 효율을 위해 immer 사용

## 2. 로그인 시 jwt 토큰, 사용자 Id, 사용자이름 저장

http://localhost:9090

## 2. 로그인 api 연동
- end-point: /api/v1/login
- http method : POST
- content-type : application/x-www-form-urlencoded
- param
    - userId
    - passwd
      -response data
```
{
    "tokenType": "Bearer",
    "accessToken": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMDEiLCJpc3MiOiJib29rcy1hcGkiLCJpYXQiOjE3NzczNzcwNzEsImV4cCI6MTc3NzM3ODg3MX0.eXfIZ8IoogvPkMNBbg6emaH61q4S-0YF4NyuvYXmoyg",
    "expiresIn": 1800,
    "userId": "user01",
    "name": "사용자1"
}
```

## 3 로그인 프로세스
- 아이디 패스워드 입력 후 로그인 시도
- 실패 시 alert 창과 에러 메세지 출력
- 성공 시 메인페이지로 이동

## 4. 폴더 위치
- zustand 설정은 stores 폴더에 저장