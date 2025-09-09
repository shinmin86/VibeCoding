# 네이버 뉴스 크롤러

네이버 검색 결과에서 신문기사 제목을 크롤링하는 Python 스크립트입니다.

## 설치 방법

1. 필요한 패키지 설치:
```bash
pip install -r requirements.txt
```

## 사용 방법

```bash
python naver_news_crawler.py
```

## 기능

- 네이버 검색 결과 페이지에서 뉴스 제목 추출
- 중복 제목 제거
- 콘솔 출력 및 CSV 파일 저장
- 한글 인코딩 지원

## 파일 설명

- `naver_news_crawler.py`: 메인 크롤링 스크립트
- `requirements.txt`: 필요한 Python 패키지 목록
- `semiconductor_news_titles.csv`: 크롤링 결과 저장 파일

## 주의사항

- 네이버의 로봇 차단 정책에 따라 접근이 제한될 수 있습니다
- 과도한 요청을 피하기 위해 적절한 딜레이를 두고 사용하세요
- 웹사이트의 이용약관을 준수하여 사용하세요

## 현재 타겟 URL

반도체 관련주 검색 결과:
`https://search.naver.com/search.naver?where=nv&sm=top_sug.pre&fbm=0&acr=1&acq=qksehcp&qdt=0&ie=utf8&query=%EB%B0%98%EB%8F%84%EC%B2%B4+%EA%B4%80%EB%A0%A8%EC%A3%BC&ackey=1p7dxcwu`

