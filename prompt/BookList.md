## 1. 책 리스트 페이지 만들기
- 메뉴별 페이지 만들기

## 2. router 경로
- book/:category
- category 항목은 메뉴별로 정의
  - bestseller(베스트셀러), new(새로운책), basic(기본서), mobile(모바일), web(프로그래밍)

## 3. api 연동
- end-point : /api/v1/books
- method : GET
- parameter
  - category : 메뉴항목
  - page : 현재 보여줄 페이지번호
  - size : 페이별 보여줄 개수 (기본 10개)

## 4. 연동데이터
``` 
{
    "code": 200,
    "data": [
        {
            "id": "BOOK014",
            "title": "스프링 부트 3 핵심 가이드",
            "subtitle": "스프링 부트 3을 활용한 애플리케이션 개발 실무",
            "author": "장정우",
            "price": 28800,
            "publishDate": "2024-09-30",
            "imageUrl": "https://image.aladin.co.kr/product/36096/9/cover200/k052038969_1.jpg"
        }
    ],
    "pageInfo": {
        "nowPageNum": 0,
        "totalRows": 10
    }
}
```

## 5. 디자인
- Pencil BookList Page를 참고