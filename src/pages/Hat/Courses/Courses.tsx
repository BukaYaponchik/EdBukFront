import React, { useEffect, useState } from 'react';
import Header from '../../../Components/Header/Header';
import { useAuth } from '../../../Context/AuthContext';
import { api, ENDPOINTS } from '../../../API/api';
import './Courses.css';

interface Course {
    id: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    sections: string[];
}

interface Section {
    id: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    topics: string[];
}

interface Topic {
    id: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    content: string;
}

const Courses: React.FC = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [sections, setSections] = useState<Section[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [view, setView] = useState<'courses' | 'sections' | 'topics' | 'content'>('courses');
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [selectedSection, setSelectedSection] = useState<Section | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

    // Загрузка курсов
    useEffect(() => {
        const loadCourses = async () => {
            try {
                setLoading(true);
                const data = await api.get(`${ENDPOINTS.COURSE}?userId=${user?.id}`);
                setCourses(data);
            } catch (err) {
                setError('Ошибка загрузки курсов');
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) {
            loadCourses();
        }
    }, [user?.id]);

    // Загрузка разделов
    const fetchSections = async (course: Course) => {
        try {
            setLoading(true);
            const data = await api.get(`${ENDPOINTS.SECTION}/${course.id}`);
            setSections(data);
            setSelectedCourse(course);
            setView('sections');
        } catch (err) {
            setError('Ошибка загрузки разделов');
        } finally {
            setLoading(false);
        }
    };

    // Загрузка тем
    const fetchTopics = async (section: Section) => {
        try {
            setLoading(true);
            const data = await api.get(`${ENDPOINTS.TOPIC}/${section.id}`);
            setTopics(data);
            setSelectedSection(section);
            setView('topics');
        } catch (err) {
            setError('Ошибка загрузки тем');
        } finally {
            setLoading(false);
        }
    };

    // Загрузка контента темы
    const handleTopicClick = async (topic: Topic) => {
        try {
            setLoading(true);
            const data = await api.get(`${ENDPOINTS.TOPIC_CONTENT}/${topic.id}`);
            setSelectedTopic({ ...topic, content: data.content });
            setView('content');
        } catch (err) {
            setError('Ошибка загрузки контента');
        } finally {
            setLoading(false);
        }
    };

    // Навигация назад
    const handleBack = () => {
        if (view === 'sections') {
            setView('courses');
            setSelectedCourse(null);
            setSections([]);
        } else if (view === 'topics') {
            setView('sections');
            setSelectedSection(null);
            setTopics([]);
        } else if (view === 'content') {
            setView('topics');
            setSelectedTopic(null);
        }
    };

    // Рендер курсов
    const renderCourses = () => {
        if (loading) return <div className="loading">Загрузка...</div>;
        if (error) return <div className="error-message">{error}</div>;
        if (courses.length === 0) return <div className="no-courses">У вас нет активных курсов</div>;

        return (
            <>
                <h2>Ваши курсы</h2>
                <div className="courses-container">
                    {courses.map(course => (
                        <div
                            key={course.id}
                            className="course-card"
                            onClick={() => fetchSections(course)}
                        >
                            <img
                                src={course.imageUrl}
                                alt={course.title}
                                className="course-image"
                            />
                            <div className="course-content">
                                <h3 className="course-title">{course.title}</h3>
                                <p className="course-subtitle">{course.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        );
    };

    // Рендер разделов
    const renderSections = () => {
        if (loading) return <div className="loading">Загрузка...</div>;
        if (error) return <div className="error-message">{error}</div>;
        if (sections.length === 0) return <div className="no-courses">В этом курсе нет разделов</div>;

        return (
            <>
                <button className="back-button" onClick={handleBack}>
                    &larr; Назад к курсам
                </button>
                <h2>{selectedCourse?.title} - Разделы</h2>
                <div className="courses-container">
                    {sections.map(section => (
                        <div
                            key={section.id}
                            className="course-card"
                            onClick={() => fetchTopics(section)}
                        >
                            <img
                                src={section.imageUrl}
                                alt={section.title}
                                className="course-image"
                            />
                            <div className="course-content">
                                <h3 className="course-title">{section.title}</h3>
                                <p className="course-subtitle">{section.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        );
    };

    // Рендер тем
    const renderTopics = () => {
        if (loading) return <div className="loading">Загрузка...</div>;
        if (error) return <div className="error-message">{error}</div>;
        if (topics.length === 0) return <div className="no-courses">В этом разделе нет тем</div>;

        return (
            <>
                <button className="back-button" onClick={handleBack}>
                    &larr; Назад к разделам
                </button>
                <h2>{selectedSection?.title} - Темы</h2>
                <div className="courses-container">
                    {topics.map(topic => (
                        <div
                            key={topic.id}
                            className="course-card"
                            onClick={() => handleTopicClick(topic)}
                        >
                            <img
                                src={topic.imageUrl}
                                alt={topic.title}
                                className="course-image"
                            />
                            <div className="course-content">
                                <h3 className="course-title">{topic.title}</h3>
                                <p className="course-subtitle">{topic.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        );
    };

    // Рендер контента темы
    const renderTopicContent = () => {
        if (!selectedTopic) return null;

        return (
            <>
                <button className="back-button" onClick={handleBack}>
                    &larr; Назад к темам
                </button>
                <h2>{selectedTopic.title}</h2>
                <div className="page-content">
                    {selectedTopic.content ? (
                        <div dangerouslySetInnerHTML={{ __html: selectedTopic.content }} />
                    ) : (
                        <p>Содержимое темы временно недоступно</p>
                    )}
                </div>
            </>
        );
    };

    return (
        <>
            <Header />
            <div className="page-content">
                {renderView()}
            </div>
        </>
    );

    function renderView() {
        switch (view) {
            case 'courses': return renderCourses();
            case 'sections': return renderSections();
            case 'topics': return renderTopics();
            case 'content': return renderTopicContent();
            default: return renderCourses();
        }
    }
};

export default Courses;