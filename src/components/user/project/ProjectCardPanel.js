import './ProjectCardPanel.css';

export default function ProjectCardPanel(props) {
    if (props.upper) {
        return (
        <svg className="ProjectCardPanel" preserveAspectRatio="none" viewBox="0 0 91 11">
            <path
                d="
                M 1 10 
                L 3 5 L 30 5
                L 32 10 L 59 10
                L 61 5 L 88 5
                L 90 10"
                fillOpacity="0"
            />

            <path
                d="
                M 32 5
                L 33 7 L 58 7
                L 59 5 Z"
            />
        </svg>)
    } else {
        return (
            <svg className="ProjectCardPanel" preserveAspectRatio="none" viewBox="0 0 91 11">
                <path
                d="
                M 1 5 
                L 3 10 L 30 10
                L 32 5 L 59 5
                L 61 10 L 88 10
                L 90 5"
                fillOpacity="0"
                />

                <path
                    d="
                    M 32 10
                    L 33 8 L 58 8
                    L 59 10 Z"
                />
            </svg>
        )
    }
}