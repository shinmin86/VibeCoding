#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
네이버 검색 결과에서 신문기사 제목을 크롤링하는 스크립트
"""

import requests
from bs4 import BeautifulSoup
import time
import csv
from urllib.parse import urljoin
import os


class NaverNewsCrawler:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        # SSL 인증서 검증 비활성화 (개발/테excel목적)
        self.session.verify = False
        # SSL 경고 메시지 숨기기
        import urllib3
        urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    
    def crawl_news_titles(self, url, debug=False):
        """
        네이버 검색 결과 페이지에서 신문기사 제목들을 크롤링합니다.
        
        Args:
            url (str): 네이버 검색 결과 URL
            debug (bool): 디버그 모드 (HTML 파일 저장)
            
        Returns:
            list: 신문기사 제목 리스트
        """
        try:
            print(f"크롤링 시작: {url}")
            
            # 페이지 요청
            response = self.session.get(url)
            response.raise_for_status()
            response.encoding = 'utf-8'
            
            # 디버그 모드: HTML 저장
            if debug:
                filename = f"debug_page_{int(time.time())}.html"
                with open(filename, 'w', encoding='utf-8') as f:
                    f.write(response.text)
                print(f"디버그: HTML 저장됨 - {filename}")
            
            # BeautifulSoup으로 HTML 파싱
            soup = BeautifulSoup(response.text, 'html.parser')
            
            news_titles = []
            
            # 네이버 검색 결과에서 뉴스 제목 추출 (개선된 버전)
            news_items = []
            
            # 1. 뉴스 검색 결과 영역에서 제목 추출
            news_areas = soup.find_all('div', class_='news_area')
            for area in news_areas:
                title_links = area.find_all('a', class_='news_tit')
                news_items.extend(title_links)
            
            # 2. 통합검색의 뉴스 영역에서 제목 추출
            if not news_items:
                news_sections = soup.find_all('div', {'data-module': 'news'})
                for section in news_sections:
                    title_links = section.find_all('a')
                    for link in title_links:
                        if 'news.naver.com' in link.get('href', ''):
                            news_items.append(link)
            
            # 3. 뉴스 제목만 포함하는 링크들 찾기 (href에 news.naver.com 포함)
            if not news_items:
                all_links = soup.find_all('a', href=True)
                for link in all_links:
                    href = link.get('href', '')
                    if 'news.naver.com' in href and '/article/' in href:
                        news_items.append(link)
            
            # 4. 마지막 방법: 제목 패턴으로 필터링
            if not news_items:
                all_links = soup.find_all('a')
                for link in all_links:
                    text = link.get_text().strip()
                    # 뉴스 제목 같은 패턴 (한글 포함, 적절한 길이)
                    if (text and 
                        len(text) > 10 and len(text) < 100 and
                        any(ord(char) >= 0xAC00 and ord(char) <= 0xD7A3 for char in text) and
                        not any(ad_word in text for ad_word in ['광고', '이벤트', '혜택', '할인', '무료', '증정', '$'])):
                        news_items.append(link)
            
            # 제목 추출
            for item in news_items:
                title = item.get_text().strip()
                if title and len(title) > 5:  # 너무 짧은 텍스트는 제외
                    # HTML 태그 제거 및 정리
                    clean_title = BeautifulSoup(title, 'html.parser').get_text().strip()
                    if clean_title not in news_titles:  # 중복 제거
                        news_titles.append(clean_title)
            
            print(f"총 {len(news_titles)}개의 뉴스 제목을 찾았습니다.")
            return news_titles
            
        except requests.exceptions.RequestException as e:
            print(f"네트워크 오류: {e}")
            return []
        except Exception as e:
            print(f"크롤링 중 오류 발생: {e}")
            return []
    
    def save_to_csv(self, titles, filename='news_titles.csv'):
        """
        크롤링한 제목들을 CSV 파일로 저장합니다.
        
        Args:
            titles (list): 뉴스 제목 리스트
            filename (str): 저장할 파일명
        """
        try:
            with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
                writer = csv.writer(csvfile)
                writer.writerow(['번호', '뉴스 제목'])  # 헤더
                
                for idx, title in enumerate(titles, 1):
                    writer.writerow([idx, title])
                    
            print(f"결과가 {filename} 파일로 저장되었습니다.")
            
        except Exception as e:
            print(f"파일 저장 중 오류 발생: {e}")
    
    def print_titles(self, titles):
        """
        크롤링한 제목들을 콘솔에 출력합니다.
        
        Args:
            titles (list): 뉴스 제목 리스트
        """
        print("\n" + "="*50)
        print("크롤링된 뉴스 제목들:")
        print("="*50)
        
        for idx, title in enumerate(titles, 1):
            print(f"{idx:2d}. {title}")
        
        print("="*50)


def main():
    """메인 실행 함수"""
    # 크롤러 인스턴스 생성
    crawler = NaverNewsCrawler()
    
    print("네이버 뉴스 제목 크롤링을 시작합니다...")
    
    # 1. 원래 검색 URL 시도
    original_url = "https://search.naver.com/search.naver?where=nv&sm=top_sug.pre&fbm=0&acr=1&acq=qksehcp&qdt=0&ie=utf8&query=%EB%B0%98%EB%8F%84%EC%B2%B4+%EA%B4%80%EB%A0%A8%EC%A3%BC&ackey=1p7dxcwu"
    print(f"\n1. 통합 검색 결과에서 크롤링 시도:")
    print(f"대상 URL: {original_url}")
    
    news_titles = crawler.crawl_news_titles(original_url, debug=True)
    
    # 2. 뉴스 전용 검색 URL 시도 (더 정확한 뉴스 결과)
    news_search_url = "https://search.naver.com/search.naver?where=news&query=%EB%B0%98%EB%8F%84%EC%B2%B4+%EA%B4%80%EB%A0%A8%EC%A3%BC&sort=1"
    print(f"\n2. 뉴스 전용 검색에서 크롤링 시도:")
    print(f"대상 URL: {news_search_url}")
    
    news_titles_2 = crawler.crawl_news_titles(news_search_url, debug=True)
    
    # 두 결과 합치기 (중복 제거)
    all_titles = news_titles + [title for title in news_titles_2 if title not in news_titles]
    
    if all_titles:
        # 결과 출력
        crawler.print_titles(all_titles)
        
        # CSV 파일로 저장
        crawler.save_to_csv(all_titles, 'semiconductor_news_titles.csv')
        
        print(f"\n크롤링 완료! 총 {len(all_titles)}개의 뉴스 제목을 수집했습니다.")
        print(f"- 통합검색: {len(news_titles)}개")
        print(f"- 뉴스검색: {len(news_titles_2)}개")
        print(f"- 중복제거 후 총합: {len(all_titles)}개")
    else:
        print("뉴스 제목을 찾지 못했습니다. 페이지 구조가 변경되었을 수 있습니다.")
        print("네이버의 로봇 차단 정책으로 인해 접근이 제한될 수 있습니다.")


if __name__ == "__main__":
    main()
