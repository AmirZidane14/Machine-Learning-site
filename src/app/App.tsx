import { Route, Routes } from 'react-router-dom'
import ComponentLabPage from '../pages/ComponentLabPage'
import HomePage from '../pages/HomePage'
import TopicPage from '../pages/TopicPage'
import Layout from './Layout'

/* The route table: which URL shows which page. Every page is wrapped in <Layout />. */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/lab" element={<ComponentLabPage />} />
        <Route path="/topic/:topicId" element={<TopicPage />} />
        <Route path="*" element={<TopicPage />} />
      </Route>
    </Routes>
  )
}
