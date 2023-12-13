import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import React from 'react';
import moment from 'moment';
import {useSelector, useDispatch} from 'react-redux';
import {deleteMatch} from '../redux/actions';
import DeleteIcon from 'react-native-vector-icons/MaterialIcons';
import PlusIcon from 'react-native-vector-icons/Entypo';
import EditIcon from 'react-native-vector-icons/Feather';

const Home = ({navigation}) => {
  const data = useSelector(state => state.matchData);
  const dispatch = useDispatch();

  const handleDelete = item => {
    Alert.alert('Delete Match', 'Are you sure to delete this match ?', [
      {
        text: 'Cancel',
      },
      {
        text: 'OK',
        onPress: () => dispatch(deleteMatch(item.id)),
      },
    ]);
  };

  const renderItem = ({item}) => {
    return (
      <View style={styles.card}>
        <View style={styles.wrapper}>
          <View style={styles.dateTime}>
            <Text style={styles.day}>{moment(item.date).format('ddd')}</Text>
            <Text style={styles.date}>{moment(item.date).format('DD')}</Text>
          </View>

          <View style={styles.dataView}>
            <Text style={styles.data}>{item.note}</Text>
            <Text style={styles.data}>
              {item.startTime} - {item.endTime}
            </Text>
            <Text style={styles.data}>
              {moment(item.date).format('MMM YYYY')}
            </Text>
          </View>

          <View style={styles.flex}>
            <TouchableOpacity
              activeOpacity={0.4}
              onPress={() => navigation.navigate('ScheduleMatch', item)}
              style={styles.icon}>
              <EditIcon name="edit" color="#3e1f56" size={18} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.4}
              onPress={() => handleDelete(item)}
              style={styles.icon}>
              <DeleteIcon name="delete-outline" color="#3e1f56" size={25} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#f5edfb'} barStyle={'dark-content'} />

      <View style={styles.button}>
        <View style={{flex: 0.9}}>
          <Text style={styles.buttonText}>Schedule New Match</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.4}
          style={styles.iconView}
          onPress={() => navigation.navigate('ScheduleMatch')}>
          <PlusIcon name="plus" size={25} color="#3e1f56" />
        </TouchableOpacity>
      </View>

      <View style={styles.headingView}>
        <Text style={styles.heading}>Upcoming Schedules</Text>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        keyExtractor={item => item.id}
        renderItem={item => renderItem(item)}
        ListEmptyComponent={() => {
          return (
            <View style={styles.noDataView}>
              <Text style={styles.noDataText}>No data found !!!</Text>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#ffffff'},
  button: {
    backgroundColor: '#8451cb',
    borderRadius: 15,
    marginHorizontal: 15,
    marginVertical: 20,
    padding: 15,
    // justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  headingView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    marginHorizontal: 15,
    alignItems: 'center',
  },
  heading: {fontSize: 16, fontWeight: '600', color: '#000'},
  noDataView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: '50%',
  },
  noDataText: {fontSize: 20, fontWeight: '800', color: '#3e1f56'},
  card: {
    backgroundColor: '#e1caf3',
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 15,
  },
  wrapper: {flexDirection: 'row', margin: 15},
  dateTime: {
    flex: 0.2,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  day: {fontSize: 15, fontWeight: '500', color: '#3e1f56'},
  date: {fontSize: 24, fontWeight: '800', color: '#3e1f56'},
  dataView: {flex: 0.7, justifyContent: 'center', marginHorizontal: 10},
  data: {fontSize: 14, fontWeight: '500', color: '#000'},
  flex: {flex: 0.1},
  icon: {flex: 0.5, justifyContent: 'center', alignItems: 'center'},
  iconView: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
