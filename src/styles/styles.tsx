import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    logo: {
        width: 150,
        height: 163,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    tagline: {
        fontSize: 14,
        color: '#FFFFFF',
        marginBottom: 20,
    },
    header: {
        alignSelf: 'center',
        fontSize: 32,
        fontWeight: '700',
        marginVertical: 20,
        color: '#FFFFFF',
    },
    subheader: {
        alignSelf: 'flex-start',
        fontSize: 16,
        color: '#FFFFFF',
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#757575',
        borderWidth: 1,
        borderRadius: 20,
        marginBottom: 15,
        backgroundColor: '#FFFFFF',
        width: '100%',
    },
    icon: {
        paddingLeft: 20,
        paddingRight: 20,
    },
    input: {
        height: 40,
        flex: 1,
        paddingVertical: 10,
        borderRadius: 20,
        color: '#000000',
    },
    button: {
        height: 40,
        width: '100%',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        marginTop: 20,
    },
    buttonText: {
        color: '#059212',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    registerLink: {
        marginTop: 20,
    },
    registerText: {
        color: '#FFFFFF',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});

export default styles;