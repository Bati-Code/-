
const SESSION_STORE = 'sessionStore/SESSION_STORE';
const SESSION_DESTROY = 'sessionStore/SESSION_DESTROY';

export const Session_Store = () => ({ type: SESSION_STORE});
export const Session_Destroy = () => ({ type: SESSION_DESTROY});

const initialState = {
    session: false,
};

const sessionStore = (state = initialState, action) => {
    switch (action.type) {
        case SESSION_STORE:
            return {
                ...state,
                session: true
            };
        case SESSION_DESTROY:
            return {
                ...state,
                session: false
            };

        default:
            return { ...state };
    }
}

export default sessionStore;