// components/TodosComponent.js
import React, { useState, useEffect } from 'react';
import { Image, View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, removeTodoAsync, replaceTodos, updateTodo, updateTodoTextAsync } from '../store/todosSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
export default function TodosComponent() {
    const [newTodo, setNewTodo] = useState('');
    const todos = useSelector(state => state.todos.todos);
    const dispatch = useDispatch();
    const [imageUri, setImageUri] = useState('');
    const weather = useSelector(state => state.weather.data);
    const weatherCondition = weather ? weather.weather[0].main : 'Not available';
    const [editableTodoId, setEditableTodoId] = useState(null);
    const [editedText, setEditedText] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImageUri, setSelectedImageUri] = useState(null);
    useEffect(() => {
        const loadTodos = async () => {
            const todosString = await AsyncStorage.getItem('todos');
            if (todosString) {
                const savedTodos = JSON.parse(todosString);
                dispatch(replaceTodos(savedTodos));
            }
        };
        loadTodos();
    }, []);
    // 请求摄像头和相册访问权限
    useEffect(() => {
        (async () => {
            const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
            const mediaLibraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (cameraStatus.status !== 'granted' || mediaLibraryStatus.status !== 'granted') {
                alert('Sorry, we need camera and photo permissions to make this work!');
            }
        })();
    }, []);


    // 处理拍照功能
    const handleTakePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled && result.assets) {
            setImageUri(result.assets[0].uri);
            console.log('Photo taken, imageUri:', result.assets[0].uri); // 现在使用 result.assets[0].uri
        }
    };
    // 从相册选择图片的功能
    const pickImageFromGallery = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setImageUri(result.assets[0].uri);
        }
    };
    const handleImagePress = (uri) => {
        setSelectedImageUri(uri);
        setModalVisible(true); // 设置模态框为可见
    };
    const handleAddTodo = async () => {
        const now = new Date();
        const timeString = `${now.getHours()}:${now.getMinutes()}, ${now.toDateString()}`;
        const todo = {
            id: Date.now(),
            text: newTodo,
            weather: weatherCondition,
            image: imageUri,
            time: timeString
        };
        console.log('Adding todo with image:', todo);
        dispatch(addTodo(todo));

        // 保存新的待办事项数组到 AsyncStorage
        const updatedTodos = [...todos, todo];
        await AsyncStorage.setItem('todos', JSON.stringify(updatedTodos));

        setNewTodo('');
        setImageUri('');
    };

    const updateTodoText = async (id, text) => {
        dispatch(updateTodoTextAsync({ id, text }));
        const updatedTodos = todos.map(todo => todo.id === id ? { ...todo, text } : todo);
        await AsyncStorage.setItem('todos', JSON.stringify(updatedTodos));
        setEditableTodoId(null);
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="What needs to be done?"
                value={newTodo}
                onChangeText={setNewTodo}
                style={styles.input}
            />
            <View style={styles.buttonRow}>
                <TouchableOpacity onPress={handleTakePhoto} style={styles.button}>
                    {/* 使用图标代替文字按钮 */}
                    <Text style={styles.buttonText}>📷 Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={pickImageFromGallery} style={styles.button}>
                    <Text style={styles.buttonText}>🖼️ Gallery</Text>
                </TouchableOpacity>
            </View>
            {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} /> : null}
            <TouchableOpacity onPress={handleAddTodo} style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Add Todo</Text>
            </TouchableOpacity>
            <FlatList
                data={todos}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.todoItem}>
                        <Text style={styles.todoInfo}>Time: {item.time}</Text>
                        <Text style={styles.todoInfo}>Weather: {item.weather}</Text>
                        {item.image ? (
                            <TouchableOpacity onPress={() => handleImagePress(item.image)}>
                                <Image source={{ uri: item.image }} style={styles.image} />
                            </TouchableOpacity>
                        ) : null}
                        {editableTodoId === item.id ? (
                            <TextInput
                                style={styles.input}
                                onChangeText={setEditedText}
                                value={editedText}
                                onEndEditing={() => updateTodoText(item.id, editedText)}
                            />
                        ) : (
                            <Text style={styles.todoText}>{item.text}</Text>
                        )}
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity onPress={() => dispatch(removeTodoAsync(item.id))} style={[styles.button, styles.leftButton]}>
                                <Text style={styles.buttonText}>✔️ Done</Text>
                            </TouchableOpacity>
                            {editableTodoId !== item.id && (
                                <TouchableOpacity onPress={() => { setEditableTodoId(item.id); setEditedText(item.text); }} style={[styles.button, styles.rightButton]}>
                                    <Text style={styles.buttonText}>✏️ Edit</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                )}
            />
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Image source={{ uri: selectedImageUri }} style={styles.fullImage} />
                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.textStyle}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 30,
        paddingHorizontal: 20,
        backgroundColor: '#ffffff',
    },
    input: {
        width: '100%',
        padding: 15,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#cccccc',
        borderRadius: 10,
        backgroundColor: '#f9f9f9',
    },
    todoItem: {
        width: 350,
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#f0f0f0',
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        justifyContent: 'space-between',
        flexDirection: 'column',
    },
    todoText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    todoInfo: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 10,
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 10,
        alignSelf: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#4267B2',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    addButton: {
        backgroundColor: '#42B72A',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    inputLarge: {
        width: '100%',

    },
    centeredView: {

        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {

        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    fullImage: {

        width: 400,
        height: 400,
    },
    buttonClose: {

        backgroundColor: '#2196F3',
    },
    textStyle: {

        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    },
});
