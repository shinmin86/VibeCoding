# 오늘의 할일 (Today's Todo)

Next.js, TypeScript, Tailwind CSS, shadcn/ui를 사용하여 만든 간단하고 효율적인 일일 할일 관리 앱입니다.

## 주요 기능

- ✅ 할일 추가, 완료, 삭제
- 📊 실시간 진행률 표시
- 🎨 모던하고 반응형 UI
- 🌟 부드러운 애니메이션
- 📱 모바일 친화적 디자인

## 기술 스택

- **Next.js 15** - React 프레임워크
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 유틸리티 기반 CSS
- **shadcn/ui** - 재사용 가능한 UI 컴포넌트
- **Radix UI** - 접근성 우선 기본 컴포넌트
- **Lucide React** - 아이콘

## 시작하기

### 의존성 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션을 확인하세요.

### 빌드

```bash
npm run build
```

### 프로덕션 실행

```bash
npm start
```

## 프로젝트 구조

```
todolist/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── input.tsx
│   │   │   └── progress.tsx
│   │   ├── add-todo.tsx
│   │   ├── progress-bar.tsx
│   │   └── todo-item.tsx
│   └── lib/
│       └── utils.ts
├── components.json
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## 사용법

1. 상단 입력 필드에 할일을 입력하고 Enter를 누르거나 + 버튼을 클릭
2. 체크박스를 클릭하여 할일을 완료로 표시
3. 휴지통 아이콘을 클릭하여 할일 삭제
4. 진행률 바에서 전체 진행 상황 확인

## 라이선스

MIT
