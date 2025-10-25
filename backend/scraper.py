from playwright.sync_api import sync_playwright
import requests
import json
import time
import re
from typing import Optional, Dict, Any

class NewsScraper:
    def __init__(self):
        self.user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        
        # 주요 뉴스 사이트별 콘텐츠 선택자
        self.content_selectors = [
            'article .content',
            '.article-body',
            '.story-content',
            '.entry-content',
            '[data-testid="article-content"]',
            '.post-content',
            '.article-text',
            '.article-content',
            '.story-body',
            '.article-section',
            '.StandardArticleBody_body',
            '.article-page',
            '.article__content',
            '.article-main',
            '.article-wrapper',
            # 추가 뉴스 사이트 선택자
            '.article-content-body',
            '.article__body',
            '.story__body',
            '.content-body',
            '.main-content',
            '.article-text-content',
            '.entry-body',
            '.post-body',
            '.article-main-content',
            '.news-content',
            '.article-container',
            '.content-container',
            '.article-wrapper-content',
            '.story-wrapper',
            '.article-inner',
            '.content-inner',
            # NPR 특화 선택자
            '.storytext',
            '.transcript',
            '.article-content',
            # BBC 특화 선택자
            '.story-body__inner',
            '.gel-layout__item',
            # CNN 특화 선택자
            '.zn-body__paragraph',
            '.l-container',
            # Reuters 특화 선택자
            '.StandardArticleBody_body',
            '.ArticleBodyWrapper',
            # AP 특화 선택자
            '.Article',
            '.ArticleBody'
        ]
        
        # 제목 선택자
        self.title_selectors = [
            'h1',
            '.headline',
            '.title',
            '.article-title',
            '.story-headline',
            '.entry-title',
            '[data-testid="headline"]'
        ]

    def scrape_article(self, url: str) -> Optional[Dict[str, Any]]:
        """뉴스 기사 스크래핑"""
        print(f"스크래핑 시작: {url}")
        
        # 먼저 requests로 시도해보기
        try:
            result = self._scrape_with_requests(url)
            if result['success']:
                print("requests로 스크래핑 성공")
                return result
        except Exception as e:
            print(f"requests 스크래핑 실패: {e}")
        
        # requests 실패 시 Playwright 사용
        print("Playwright로 스크래핑 시도...")
        return self._scrape_with_playwright(url)
    
    def _scrape_with_requests(self, url: str) -> Dict[str, Any]:
        """requests를 사용한 간단한 스크래핑"""
        try:
            headers = {
                'User-Agent': self.user_agent,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'keep-alive',
            }
            
            response = requests.get(url, headers=headers, timeout=30)
            response.raise_for_status()
            
            from bs4 import BeautifulSoup
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # 제목 추출
            title = self._extract_title_from_soup(soup)
            
            # 본문 추출
            content = self._extract_content_from_soup(soup)
            
            # 메타데이터 추출
            metadata = self._extract_metadata_from_soup(soup)
            
            if content and len(content.strip()) > 50:
                return {
                    'success': True,
                    'title': title,
                    'content': content,
                    'url': url,
                    'metadata': metadata
                }
            else:
                return {
                    'success': False,
                    'error': f'콘텐츠를 찾을 수 없습니다. 추출된 길이: {len(content) if content else 0}자',
                    'url': url
                }
                
        except Exception as e:
            return {
                'success': False,
                'error': f'requests 스크래핑 실패: {str(e)}',
                'url': url
            }
    
    def _scrape_with_playwright(self, url: str) -> Dict[str, Any]:
        """Playwright를 사용한 스크래핑"""
        browser = None
        try:
            with sync_playwright() as p:
                # 브라우저 설정 개선
                browser = p.chromium.launch(
                    headless=True,
                    args=[
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage',
                        '--disable-accelerated-2d-canvas',
                        '--no-first-run',
                        '--no-zygote',
                        '--disable-gpu'
                    ]
                )
                
                context = browser.new_context(
                    user_agent=self.user_agent,
                    viewport={'width': 1920, 'height': 1080}
                )
                
                page = context.new_page()
                
                # 페이지 로드 (더 안전한 방식)
                print("페이지 로딩 중...")
                page.goto(url, wait_until='domcontentloaded', timeout=30000)
                
                # 페이지가 로드될 때까지 대기
                try:
                    page.wait_for_load_state('load', timeout=10000)
                except:
                    print("load 상태 대기 실패, 계속 진행...")
                
                # 추가 대기
                time.sleep(3)
                
                # 페이지가 여전히 유효한지 확인
                try:
                    page.title()  # 페이지가 살아있는지 확인
                except:
                    raise Exception("페이지가 닫혔습니다")
                
                # 제목 추출
                title = self._extract_title(page)
                print(f"추출된 제목: {title}")
                
                # 본문 추출
                content = self._extract_content(page)
                print(f"추출된 콘텐츠 길이: {len(content) if content else 0}")
                
                # 메타데이터 추출
                meta_data = self._extract_metadata(page)
                print(f"메타데이터: {meta_data}")
                
                if content and len(content.strip()) > 50:
                    return {
                        'success': True,
                        'title': title,
                        'content': content,
                        'url': url,
                        'metadata': meta_data
                    }
                else:
                    return {
                        'success': False,
                        'error': f'콘텐츠를 찾을 수 없습니다. 추출된 길이: {len(content) if content else 0}자',
                        'url': url
                    }
                    
        except Exception as e:
            error_msg = str(e)
            print(f"Playwright 오류: {error_msg}")
            
            if "Target page, context or browser has been closed" in error_msg:
                error_msg = "페이지 로딩 중 오류가 발생했습니다. 다시 시도해주세요."
            elif "timeout" in error_msg.lower():
                error_msg = "페이지 로딩 시간이 초과되었습니다. 다시 시도해주세요."
            elif "net::" in error_msg:
                error_msg = "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요."
            
            return {
                'success': False,
                'error': error_msg,
                'url': url
            }
        finally:
            # 브라우저가 아직 열려있다면 안전하게 닫기
            if browser:
                try:
                    browser.close()
                except:
                    pass

    def _extract_title(self, page) -> str:
        """제목 추출"""
        for selector in self.title_selectors:
            try:
                element = page.query_selector(selector)
                if element:
                    title = element.inner_text().strip()
                    if title and len(title) > 10:
                        return title
            except:
                continue
        
        # 메타 태그에서 제목 추출
        try:
            title = page.query_selector('meta[property="og:title"]')
            if title:
                return title.get_attribute('content', '').strip()
        except:
            pass
            
        return "제목을 찾을 수 없습니다"

    def _extract_content(self, page) -> str:
        """본문 추출"""
        print("콘텐츠 추출 시작...")
        
        for i, selector in enumerate(self.content_selectors):
            try:
                print(f"선택자 {i+1}/{len(self.content_selectors)} 시도: {selector}")
                elements = page.query_selector_all(selector)
                print(f"  - 찾은 요소 수: {len(elements)}")
                
                if elements:
                    content_parts = []
                    for j, element in enumerate(elements):
                        try:
                            text = element.inner_text().strip()
                            if text and len(text) > 50:  # 최소 50자 이상
                                content_parts.append(text)
                                print(f"  - 요소 {j+1}: {len(text)}자 텍스트 추출")
                        except Exception as e:
                            print(f"  - 요소 {j+1} 추출 실패: {e}")
                            continue
                    
                    if content_parts:
                        full_content = '\n\n'.join(content_parts)
                        # 텍스트 정리
                        full_content = self._clean_text(full_content)
                        print(f"  - 정리 후 총 길이: {len(full_content)}자")
                        if len(full_content) > 50:  # 최종 검증
                            print(f"선택자 '{selector}'로 콘텐츠 추출 성공!")
                            return full_content
                        else:
                            print(f"  - 콘텐츠가 너무 짧음: {len(full_content)}자")
                else:
                    print(f"  - 요소를 찾지 못함")
            except Exception as e:
                print(f"  - 선택자 '{selector}' 오류: {e}")
                continue
        
        # 기본 콘텐츠 선택자가 실패한 경우 일반적인 태그들 시도
        try:
            # p 태그들에서 텍스트 추출
            paragraphs = page.query_selector_all('p')
            if paragraphs:
                content_parts = []
                for p in paragraphs:
                    try:
                        text = p.inner_text().strip()
                        if text and len(text) > 30:
                            content_parts.append(text)
                    except:
                        continue
                
                if content_parts:
                    full_content = '\n\n'.join(content_parts)
                    full_content = self._clean_text(full_content)
                    if len(full_content) > 50:
                        print(f"p 태그에서 콘텐츠 추출 성공: {len(full_content)}자")
                        return full_content
        except Exception as e:
            print(f"p 태그 추출 오류: {e}")
        
        # div 태그에서도 시도
        try:
            divs = page.query_selector_all('div')
            if divs:
                content_parts = []
                for div in divs:
                    try:
                        text = div.inner_text().strip()
                        if text and len(text) > 100:  # div는 더 긴 텍스트만
                            content_parts.append(text)
                    except:
                        continue
                
                if content_parts:
                    # 가장 긴 텍스트 선택
                    longest_content = max(content_parts, key=len)
                    longest_content = self._clean_text(longest_content)
                    if len(longest_content) > 100:
                        print(f"div 태그에서 콘텐츠 추출 성공: {len(longest_content)}자")
                        return longest_content
        except Exception as e:
            print(f"div 태그 추출 오류: {e}")
        
        # 전체 페이지 텍스트에서 추출 시도
        try:
            body_text = page.query_selector('body')
            if body_text:
                full_text = body_text.inner_text()
                full_text = self._clean_text(full_text)
                if len(full_text) > 200:
                    print(f"body에서 콘텐츠 추출 성공: {len(full_text)}자")
                    return full_text
        except Exception as e:
            print(f"body 추출 오류: {e}")
        
        return ""

    def _extract_title_from_soup(self, soup) -> str:
        """BeautifulSoup을 사용한 제목 추출"""
        for selector in self.title_selectors:
            try:
                element = soup.select_one(selector)
                if element:
                    title = element.get_text().strip()
                    if title and len(title) > 10:
                        return title
            except:
                continue
        
        # 메타 태그에서 제목 추출
        try:
            meta_title = soup.find('meta', property='og:title')
            if meta_title:
                return meta_title.get('content', '').strip()
        except:
            pass
            
        return "제목을 찾을 수 없습니다"

    def _extract_content_from_soup(self, soup) -> str:
        """BeautifulSoup을 사용한 본문 추출"""
        for selector in self.content_selectors:
            try:
                elements = soup.select(selector)
                if elements:
                    content_parts = []
                    for element in elements:
                        text = element.get_text().strip()
                        if text and len(text) > 50:
                            content_parts.append(text)
                    
                    if content_parts:
                        full_content = '\n\n'.join(content_parts)
                        full_content = self._clean_text(full_content)
                        if len(full_content) > 50:
                            return full_content
            except:
                continue
        
        # p 태그들에서 텍스트 추출
        try:
            paragraphs = soup.find_all('p')
            if paragraphs:
                content_parts = []
                for p in paragraphs:
                    text = p.get_text().strip()
                    if text and len(text) > 30:
                        content_parts.append(text)
                
                if content_parts:
                    full_content = '\n\n'.join(content_parts)
                    full_content = self._clean_text(full_content)
                    if len(full_content) > 50:
                        return full_content
        except:
            pass
        
        return ""

    def _extract_metadata_from_soup(self, soup) -> Dict[str, str]:
        """BeautifulSoup을 사용한 메타데이터 추출"""
        metadata = {}
        
        try:
            # 작성자
            author_selectors = ['.author', '.byline', '.writer', '[data-testid="author"]']
            for selector in author_selectors:
                element = soup.select_one(selector)
                if element:
                    metadata['author'] = element.get_text().strip()
                    break
            
            # 발행일
            date_selectors = ['.date', '.published', '.timestamp', '[data-testid="date"]']
            for selector in date_selectors:
                element = soup.select_one(selector)
                if element:
                    metadata['published_date'] = element.get_text().strip()
                    break
            
            # 이미지
            img_element = soup.find('img')
            if img_element:
                metadata['image_url'] = img_element.get('src', '')
                
        except:
            pass
            
        return metadata

    def _extract_metadata(self, page) -> Dict[str, str]:
        """메타데이터 추출"""
        metadata = {}
        
        try:
            # 작성자
            author_selectors = ['.author', '.byline', '.writer', '[data-testid="author"]']
            for selector in author_selectors:
                element = page.query_selector(selector)
                if element:
                    metadata['author'] = element.inner_text().strip()
                    break
            
            # 발행일
            date_selectors = ['.date', '.published', '.timestamp', '[data-testid="date"]']
            for selector in date_selectors:
                element = page.query_selector(selector)
                if element:
                    metadata['published_date'] = element.inner_text().strip()
                    break
            
            # 이미지
            img_element = page.query_selector('article img, .article img, .story img')
            if img_element:
                metadata['image_url'] = img_element.get_attribute('src', '')
                
        except:
            pass
            
        return metadata

    def _clean_text(self, text: str) -> str:
        """텍스트 정리"""
        # 불필요한 공백 제거
        text = re.sub(r'\s+', ' ', text)
        
        # 특수 문자 정리
        text = re.sub(r'[^\w\s.,!?;:()\-"\']', '', text)
        
        # 연속된 줄바꿈 제거
        text = re.sub(r'\n\s*\n', '\n\n', text)
        
        return text.strip()

# 사용 예시
if __name__ == "__main__":
    scraper = NewsScraper()
    
    # 테스트 URL
    test_url = "https://www.bbc.com/news/world-europe-67823456"
    
    result = scraper.scrape_article(test_url)
    
    if result['success']:
        print("스크래핑 성공!")
        print(f"제목: {result['title']}")
        print(f"내용 길이: {len(result['content'])} 문자")
        print(f"내용 미리보기: {result['content'][:200]}...")
    else:
        print(f"스크래핑 실패: {result['error']}")