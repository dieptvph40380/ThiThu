import {
    View,
    Text,
    FlatList,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    Modal,
    TextInput,
    Button,
    StyleSheet,
} from 'react-native'
import React, { useEffect, useState } from 'react'

const Home = () => {
    const [data, setData] = useState([]);
    const [index, setIndex] = useState(0);
    const [showDialogAdd, setShowDialogAdd] = useState(false);
    const [showDialogUpdate, setShowDialogUpdate] = useState(false);
    const [showDialogDetail, setShowDialogDetail] = useState(false);

    const [name, setname] = useState('');
    const [gender, setgender] = useState(true);
    const [date, setDate] = useState('');
    const [trangthai, setTrangThai] = useState(true);
    const [image, setimage] = useState('');

    const [loading, setLoading] = useState(true);
    const [idItem, setIdItem] = useState(''); // Sử dụng useState để quản lý idItem

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    // State cho việc chỉnh sửa nhân viên
    const [updateName, setUpdateName] = useState('');
    const [updateGender, setUpdateGender] = useState(true);
    const [updateDate, setUpdateDate] = useState('');
    const [updateTrangthai, setUpdateTrangThai] = useState(true);
    const [updateImage, setUpdateImage] = useState('');

    // Call api
    useEffect(() => {
        fetch('http://192.168.1.4:3000/List')
            .then(response => response.json())
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(error => console.log(error));
    }, []);

    if (loading) {
        return <ActivityIndicator />;
    }

    const ItemList = ({ item }: any) => {
        return (
            <View
                style={{
                    backgroundColor: 'red',
                    width: '90%',
                    alignSelf: 'center',
                    marginBottom: 20,
                    flexDirection: 'row',
                }}>
                <View style={{ flex: 4 }}>
                    <Image
                        source={{ uri: item.image }}
                        style={{ width: 50, height: 50 }}
                        resizeMode="contain"
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <TouchableOpacity
                            onPress={() => {
                                setname(item.name);
                                setgender(item.gender);
                                setimage(item.image);
                                setShowDialogDetail(true);
                            }}>
                            <Text style={{ fontSize: 30 }}>{item.name}</Text>
                        </TouchableOpacity>
                        <Text>{item.gender ? 'Nam' : 'Nữ'}</Text>
                    </View>
                    <Text>{item.trangthai ? 'Chính thức' : 'Thử việc'}</Text>
                </View>
                {/* Suaa va xoa */}
                <View style={{ flex: 1, justifyContent: 'space-around' }}>
                    <TouchableOpacity
                        onPress={() => {
                            setIdItem(item.id); // Cập nhật idItem khi nhấn vào nút 'Sửa'
                            setUpdateName(item.name);
                            setUpdateGender(item.gender);
                            setUpdateDate(item.date);
                            setUpdateImage(item.image);
                            setShowDialogUpdate(true);
                        }}>
                        <Text>Sửa</Text>
                    </TouchableOpacity>
                    {/* Xoa */}
                    <TouchableOpacity
                        onPress={() => {
                            setIdItem(item.id); // Cập nhật idItem khi nhấn vào nút 'Xóa'
                            Alert.alert(
                                'Xóa Nhân Viên?',
                                'Bạn có chắc muốn xóa',
                                [
                                    {
                                        text: 'Có',
                                        onPress: () => {
                                            fetch(`http://192.168.1.4:3000/List/${item.id}`, {
                                                method: 'DELETE',
                                            })
                                                .then(response => {
                                                    if (response.ok) {
                                                        Alert.alert('Xóa thành công');
                                                        fetch('http://192.168.1.4:3000/List')
                                                            .then(response => response.json())
                                                            .then(data => {
                                                                setData(data);
                                                                setLoading(false);
                                                            })
                                                            .catch(error => console.error(error));
                                                        setIndex(data.length);
                                                    } else Alert.alert('Lỗi', 'Xóa thất bại');
                                                })
                                                .catch(e => {
                                                    console.log(e);
                                                });
                                        },
                                    },
                                    { text: 'Không', onPress: () => { } },
                                ],
                                { cancelable: false }
                            );
                        }}>
                        <Text>Xóa</Text>
                    </TouchableOpacity>
                </View>
                {/* Close sua va xoa */}
            </View>
        );
    };

    const handleAddStaff = () => {
        if (name.length === 0 || image.length === 0) {
            Alert.alert('Không được để trống');
            return;
        }
        if (!dateRegex.test(date)) {
            Alert.alert(
                'Ngày không hợp lệ',
                'Vui lòng nhập theo định dạng yyyy-mm-dd'
            );
            return;
        }
        const newStaff = {
            name: name,
            gender: gender,
            date: date,
            image: image,
            trangthai: trangthai,
        };

        fetch('http://192.168.1.4:3000/List', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newStaff),
        })
            .then(response => {
                if (response.ok) {
                    Alert.alert('Thêm thành công');
                    fetch('http://192.168.1.4:3000/List')
                        .then(response => response.json())
                        .then(data => {
                            setData(data);
                            setLoading(false);
                            setShowDialogAdd(false);
                        })
                        .catch(error => console.log(error));
                    setIndex(data.length);
                } else Alert.alert('Lỗi', 'Thêm thất bại');
            })
            .catch(e => {
                console.log(e);
            });
    };

    const handUpdateStaff = () => {
        const updateStaff = {
            id: idItem,
            name: updateName,
            gender: updateGender,
            date: updateDate,
            image: updateImage,
            trangthai: updateTrangthai,
        };

        // Kiểm tra xem id của nhân viên có tồn tại hay không
        if (!idItem) {
            Alert.alert('Lỗi', 'Không tìm thấy ID nhân viên');
            return;
        }

        // Kiểm tra xem các trường thông tin cần thiết đã được điền đầy đủ chưa
        if (!updateName || !updateImage || !updateDate) {
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
            return;

        } if (!dateRegex.test(updateDate)) {
            Alert.alert('L��i', 'Ngày không h��p lệ');
            return;
        }

        // Thực hiện yêu cầu PUT để cập nhật nhân viên
        fetch(`http://192.168.1.4:3000/List/${idItem}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateStaff),
        })
            .then(res => {
                if (res.ok) {
                    Alert.alert('Sửa thành công');
                    // Cập nhật state data sau khi sửa thành công
                    fetch('http://192.168.1.4:3000/List')
                        .then(response => response.json())
                        .then(data => {
                            setData(data); // Cập nhật state data
                            setLoading(false);
                            setShowDialogUpdate(false);
                        })
                        .catch(error => console.log(error));
                } else {
                    // Hiển thị cảnh báo nếu yêu cầu PUT thất bại
                    Alert.alert('Lỗi', 'Sửa thất bại');
                }
            })
            .catch(err => {
                // Hiển thị cảnh báo nếu có lỗi xảy ra trong quá trình gửi yêu cầu PUT
                console.log('Error:', err);
                Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ');
            });
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#edf2fa' }}>
            <FlatList
                extraData={index}
                data={data}
                keyExtractor={item => item.id}
                renderItem={ItemList}
            />
            {/* Chuc nang Add */}
            <TouchableOpacity
                onPress={() => setShowDialogAdd(true)}
                style={{
                    backgroundColor: 'green',
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                    margin: 20,
                }}>
                <Text>Thêm</Text>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={showDialogAdd}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                    }}>
                    <View
                        style={{
                            width: 350,
                            height: 350,
                            backgroundColor: 'white',
                        }}>
                        <TextInput
                            placeholder="Họ tên"
                            onChangeText={txt => setname(txt)}
                            style={{
                                borderColor: 'gray',
                                borderWidth: 2,
                                margin: 10,
                                borderRadius: 20,
                            }}
                        />

                        <TextInput
                            onChangeText={txt => setimage(txt)}
                            placeholder="Link ảnh"
                            style={{
                                borderColor: 'gray',
                                borderWidth: 2,
                                margin: 10,
                                borderRadius: 20,
                            }}
                        />
                        <TextInput
                            placeholder="Ngày Sinh"
                            onChangeText={txt => setDate(txt)}
                            style={{
                                borderColor: 'gray',
                                borderWidth: 2,
                                margin: 10,
                                borderRadius: 20,
                            }}
                        />
                        <View
                            style={{
                                flexDirection: 'row',
                                margin: 10,
                                alignItems: 'center',
                            }}>
                            <Text>Giới tính:</Text>
                            <TouchableOpacity
                                onPress={() => setgender(!gender)}
                                style={{
                                    borderColor: 'gray',
                                    borderWidth: 2,
                                    borderRadius: 20,
                                    height: 50,
                                    justifyContent: 'center',
                                    paddingHorizontal: 10,
                                    marginLeft: 10,
                                }}>
                                <Text>{gender ? 'Nam' : 'Nữ'}</Text>
                            </TouchableOpacity>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                margin: 10,
                                alignItems: 'center',
                            }}>
                            <Text>Trạng thái:</Text>
                            <TouchableOpacity
                                onPress={() => setTrangThai(!trangthai)}
                                style={{
                                    borderColor: 'gray',
                                    borderWidth: 2,
                                    borderRadius: 20,
                                    height: 50,
                                    justifyContent: 'center',
                                    paddingHorizontal: 10,
                                    marginLeft: 10,
                                }}>
                                <Text>{trangthai ? 'Chính thức' : 'Thử việc'}</Text>
                            </TouchableOpacity>
                        </View>

                        <Button title="Thêm" onPress={handleAddStaff} />
                        <Button
                            title="Hủy"
                            color="red"
                            onPress={() => setShowDialogAdd(false)}
                        />
                    </View>
                </View>
            </Modal>
            {/* Close chuc nang add */}
            {/* Chuc nang xem chi tiet */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showDialogDetail}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                    }}>
                    <View
                        style={{
                            width: 350,
                            height: 'auto',
                            backgroundColor: 'white',
                        }}>
                        <Image width={350} height={350} source={{ uri: image }} />

                        <Text
                            style={{
                                borderColor: 'gray',
                                borderWidth: 2,
                                borderRadius: 20,
                                paddingHorizontal: 10,
                                margin: 10,
                            }}>
                            {name}
                        </Text>
                        <Text
                            style={{
                                borderColor: 'gray',
                                borderWidth: 2,
                                borderRadius: 20,
                                paddingHorizontal: 10,
                                margin: 10,
                            }}>
                            {date}
                        </Text>
                        <Text
                            style={{
                                borderColor: 'gray',
                                borderWidth: 2,
                                borderRadius: 20,
                                paddingHorizontal: 10,
                                margin: 10,
                            }}>
                            {gender ? 'Nam' : 'Nữ'}
                        </Text>

                        <Text
                            style={{
                                borderColor: 'gray',
                                borderWidth: 2,
                                borderRadius: 20,
                                paddingHorizontal: 10,
                                margin: 10,
                            }}>
                            {trangthai ? 'Chính thức' : 'Thử việc'}
                        </Text>
                        <Button
                            title="Hủy"
                            color="red"
                            onPress={() => setShowDialogDetail(false)}
                        />
                    </View>
                </View>
            </Modal>
            {/* Close xem chi tiet */}
            <Modal animationType="slide" transparent={true} visible={showDialogUpdate}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                    }}>
                    <View
                        style={{
                            width: 350,
                            height: 350,
                            backgroundColor: 'white',
                        }}>
                        <TextInput
                            placeholder="Họ tên"
                            onChangeText={txt => setUpdateName(txt)}
                            value={updateName}
                            style={{
                                borderColor: 'gray',
                                borderWidth: 2,
                                margin: 10,
                                borderRadius: 20,
                            }}
                        />

                        <TextInput
                            onChangeText={txt => setUpdateImage(txt)}
                            value={updateImage}
                            placeholder="Link ảnh"
                            style={{
                                borderColor: 'gray',
                                borderWidth: 2,
                                margin: 10,
                                borderRadius: 20,
                            }}
                        />
                        <TextInput
                            placeholder="Ngày Sinh"
                            onChangeText={txt => setUpdateDate(txt)}
                            value={updateDate}
                            style={{
                                borderColor: 'gray',
                                borderWidth: 2,
                                margin: 10,
                                borderRadius: 20,
                            }}
                        />
                        <View
                            style={{
                                flexDirection: 'row',
                                margin: 10,
                                alignItems: 'center',
                            }}>
                            <Text>Giới tính:</Text>
                            <TouchableOpacity
                                onPress={() => setUpdateGender(!updateGender)}
                                style={{
                                    borderColor: 'gray',
                                    borderWidth: 2,
                                    borderRadius: 20,
                                    height: 50,
                                    justifyContent: 'center',
                                    paddingHorizontal: 10,
                                    marginLeft: 10,
                                }}>
                                <Text>{updateGender ? 'Nam' : 'Nữ'}</Text>
                            </TouchableOpacity>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                margin: 10,
                                alignItems: 'center',
                            }}>
                            <Text>Trạng thái:</Text>
                            <TouchableOpacity
                                onPress={() => setUpdateTrangThai(!updateTrangthai)}
                                style={{
                                    borderColor: 'gray',
                                    borderWidth: 2,
                                    borderRadius: 20,
                                    height: 50,
                                    justifyContent: 'center',
                                    paddingHorizontal: 10,
                                    marginLeft: 10,
                                }}>
                                <Text>{updateTrangthai ? 'Chính thức' : 'Thử việc'}</Text>
                            </TouchableOpacity>
                        </View>

                        <Button title="Sửa" onPress={handUpdateStaff} />
                        <Button
                            title="Hủy"
                            color="red"
                            onPress={() => setShowDialogUpdate(false)}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default Home

const styles = StyleSheet.create({})