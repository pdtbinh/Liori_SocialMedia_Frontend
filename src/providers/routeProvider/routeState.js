export const initialRoute = {
    // user

    // viewedUser
    // viewedProjects
    // viewedEducations
    // viewedExperiences

    // route
    // users
    // users_scroll
    initial: 'set',
}

export const routeReducer = (state, action) => {
    switch (action.type) {
        case 'signin':
            return {...state, 
                user: action.user,
            };

        case 'signout': 
            let newState = {...state};
            delete newState.user;
            return newState;

        case 'view':
            return {...state, 
                viewedUser: action.viewedUser,
                viewedProjects: action.viewedProjects,
                viewedEducations: action.viewedEducations,
                viewedExperiences: action.viewedExperiences,
                viewedCertificates: action.viewedCertificates,
            };

        case 'route':
            return {...state, route: action.route};

        case 'users':
            return {...state, users: action.users};

        case 'edit_user':
            return {...state, user: action.user, viewedUser: action.user};

        case 'add_project':
            // action requires: new project to be added
            if (state.viewedProjects) {
                let currentProjects = state.viewedProjects;
                currentProjects.push(action.project);
                return {...state, viewedProjects: currentProjects};
            } else {
                return {...state, viewedProjects: [action.project]};
            }

        case 'delete_project':
            // action requires: projectID of deleted project
            const leftProjects = state.viewedProjects.filter(p => p._id.toString() !== action.projectID);
            return {...state, viewedProjects: leftProjects};

        case 'edit_project':
            // action requires: projectID of editted project, eddited project from server
            let newProjects = state.viewedProjects;
            newProjects[newProjects.findIndex(p => p._id.toString() === action.projectID)] = action.project;
            return {...state, viewedProjects: newProjects};
            
        case 'add_education':
            // action requires: new education to be added
            if (state.viewedEducations) {
                let currentEducations = state.viewedEducations;
                currentEducations.push(action.education);
                return {...state, viewedEducations: currentEducations};
            } else {
                return {...state, viewedEducations: [action.education]};
            }

        case 'delete_education':
            // action requires: educationID of deleted education
            const leftEducations = state.viewedEducations.filter(p => p._id.toString() !== action.educationID);
            return {...state, viewedEducations: leftEducations};

        case 'edit_education':
            // action requires: educationID of editted education, eddited education from server
            let newEducations = state.viewedEducations;
            newEducations[newEducations.findIndex(p => p._id.toString() === action.educationID)] = action.education;
            return {...state, viewedEducations: newEducations};
            
        case 'add_experience':
            // action requires: new experience to be added
            if (state.viewedExperiences) {
                let currentExperiences = state.viewedExperiences;
                currentExperiences.push(action.experience);
                return {...state, viewedExperiences: currentExperiences};
            } else {
                return {...state, viewedExperiences: [action.experience]};
            }

        case 'delete_experience':
            // action requires: experienceID of deleted experience
            const leftExperiences = state.viewedExperiences.filter(p => p._id.toString() !== action.experienceID);
            return {...state, viewedExperiences: leftExperiences};

        case 'edit_experience':
            // action requires: experienceID of editted experience, eddited experience from server
            let newExperiences = state.viewedExperiences;
            newExperiences[newExperiences.findIndex(p => p._id.toString() === action.experienceID)] = action.experience;
            return {...state, viewedExperiences: newExperiences};

        case 'add_certificate':
            // action requires: new certificate to be added
            if (state.viewedCertificates) {
                let currentCertificates = state.viewedCertificates;
                currentCertificates.push(action.certificate);
                return {...state, viewedCertificates: currentCertificates};
            } else {
                return {...state, viewedCertificates: [action.certificate]};
            }

        case 'delete_certificate':
            // action requires: certificateID of deleted certificate
            const leftCertificates = state.viewedCertificates.filter(p => p._id.toString() !== action.certificateID);
            return {...state, viewedCertificates: leftCertificates};

        case 'edit_certificate':
            // action requires: certificateID of editted certificate, eddited certificate from server
            let newCertificates = state.viewedCertificates;
            newCertificates[newCertificates.findIndex(p => p._id.toString() === action.certificateID)] = action.certificate;
            return {...state, viewedCertificates: newCertificates};
            
        default:
            return {...state};
    }
}